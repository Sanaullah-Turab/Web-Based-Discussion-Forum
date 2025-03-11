from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CategorySerializer, TagSerializer, ForumSerializer, ForumMembershipSerializer, MessageSerializer, MessageMentionSerializer
from .models import Category, Tag, Forum, ForumMembership, Message, MessageMention
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import viewsets

class CategoryList(APIView):
    """
    API endpoint to list all categories
    """
    permission_classes = []
    
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
class TagList(APIView):
    """
    API endpoint to list all tags
    """
    permission_classes = []
    
    def get(self, request):
        tags = Tag.objects.all()
        serializer = TagSerializer(tags, many=True)
        return Response(serializer.data)
    
class ForumViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides the standard actions for Forum:
    create, retrieve, update, partial_update, and destroy.
    """
    serializer_class = ForumSerializer
    # Only show forums that are not marked as deleted
    queryset = Forum.objects.filter(is_deleted=False)
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get_queryset(self):
        queryset = Forum.objects.filter(is_deleted=False)
        category_id = self.request.query_params.get('category_id')
        tags_ids = self.request.query_params.getlist('tags_id')
        user_id = self.request.query_params.get('user_id')
        is_locked = self.request.query_params.get('is_locked')

        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if tags_ids:
            # This will return forums that have at least one of the specified tags.
            queryset = queryset.filter(tags__id__in=tags_ids)
        if user_id:
            queryset = queryset.filter(created_by_id=user_id)
            
        if is_locked:
            queryset = queryset.filter(is_locked=is_locked)
        
        return queryset.distinct()

    def perform_create(self, serializer):
        # Set the current logged-in user as the creator.
        serializer.save(created_by=self.request.user)

    def perform_destroy(self, instance):
        # Instead of hard deletion, mark the forum as deleted.
        instance.is_deleted = True
        instance.save()