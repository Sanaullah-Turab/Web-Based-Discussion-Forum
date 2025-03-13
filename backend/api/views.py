from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CategorySerializer, TagSerializer, ForumSerializer, ForumMembershipSerializer, MessageSerializer, MessageMentionSerializer
from .models import Category, Tag, Forum, ForumMembership, Message, MessageMention
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination

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
    

class ForumPagination(PageNumberPagination):
    page_size = 10  # Default page size
    page_size_query_param = 'page_size'  # Allow client to override using query parameter
    max_page_size = 100  # Maximum allowed page size
    
    
    
class ForumViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides the standard actions for Forum:
    create, retrieve, update, partial_update, and destroy.
    """
    serializer_class = ForumSerializer
    # Only show forums that are not marked as deleted
    queryset = Forum.objects.filter(is_deleted=False)
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = ForumPagination 
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
        
class ForumMembershipViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides the standard actions for ForumMembership:
    create, retrieve, update, partial_update, and destroy.
    """
    serializer_class = ForumMembershipSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """
        Optionally filter by forum_id or user_id
        """
        
        queryset = ForumMembership.objects.all()
        user_id = self.request.query_params.get('user_id')
        forum_id = self.request.query_params.get('forum_id')
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
            
        if forum_id:
            queryset = queryset.filter(forum_id=forum_id)
            
        return queryset
    
    def perform_create(self, serializer):
        """
        Ensure the user creating membership is assigned correctly
        """
        serializer.save(user = self.request.user)
        
class MessageViewSet(viewsets.ModelViewSet):
    """
    A viewsets that provides the standard actions for Message:
    create, retrieve, update, partial_update, and destroy.
    """
    
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Message.objects.all()
        user_id = self.request.query_params.get('user_id')
        forum_id = self.request.query_params.get('forum_id')
        mentioned_user_id = self.request.query_params.get('mentioned_user_id')
        if mentioned_user_id:
            queryset = queryset.filter(mentions__mentioned_user_id=mentioned_user_id)
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        if forum_id:
            queryset = queryset.filter(forum_id=forum_id)
            
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user = self.request.user)
        
class MessageMentionViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides the standard actions for MessageMention:
    create, retrieve, update, partial_update, and destroy.
    """
    serializer_class = MessageMentionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = MessageMention.objects.all()
        # user_id = self.request.query_params.get('user_id')
        message_id = self.request.query_params.get('message_id')
        
        # if user_id:
        #     queryset = queryset.filter(mentioned_user_id=user_id)
        
        queryset = queryset.filter(mentioned_user=self.request.user)
        if message_id:
            queryset = queryset.filter(message_id=message_id)
            
        return queryset