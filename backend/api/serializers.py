from rest_framework import serializers
from . import models
from myauth.serializers import NestedUserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = '__all__'
        
    def create(self, validated_data):
        return models.Category.objects.create(**validated_data)

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tag
        fields = '__all__'
        
# class ForumSerializer(serializers.ModelSerializer):
#     # created_by = NestedUserSerializer(read_only=True)
#     class Meta:
#         model = models.Forum
#         fields = '__all__'
#         read_only_fields = ('created_by', 'created_at', 'updated_at')
#         depth = 1
class ForumSerializer(serializers.ModelSerializer):
    # Read-only nested representations
    category_detail = CategorySerializer(source='category', read_only=True)
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    created_by = NestedUserSerializer(read_only=True)
    
    # Write-only fields for input
    category = serializers.PrimaryKeyRelatedField(
        queryset=models.Category.objects.all(), write_only=True
    )
    tags = serializers.PrimaryKeyRelatedField(
        queryset=models.Tag.objects.all(), many=True, write_only=True
    )

    class Meta:
        model = models.Forum
        fields = [
            'id',
            'name',
            'category',        # Write-only input
            'tags',            # Write-only input
            'category_detail', # Read-only nested output
            'tags_detail',     # Read-only nested output
            'description',
            'created_by',
            'is_locked',
            'is_deleted',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']

    
class ForumMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ForumMembership
        fields = '__all__'
        
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Message
        fields = '__all__'
        
class MessageMentionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MessageMention
        fields = '__all__'
