from django.db import models
from django.conf import settings
import re

# Categories for forums (e.g., Technology, Science)
class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# Tags for filtering forums
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# Main Forum model
class Forum(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='forums')
    tags = models.ManyToManyField(Tag, blank=True, related_name='forums')
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_forums')
    is_locked = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    
        

# Many-to-many relationship: Users joining Forums
class ForumMembership(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='memberships')
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, related_name='memberships')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'forum')

# Messages within forums; supports threaded replies using a self-reference
class Message(models.Model):
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='messages')
    content = models.TextField()
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Message by {self.user} in {self.forum}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.extract_mentions()
        
    def extract_mentions(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        mentioned_usernames = re.findall(r'@(\w+)', self.content)
        for username in mentioned_usernames:
            try:
                user = User.objects.get(name=username)
                MessageMention.objects.create(message=self, mentioned_user=user)
            except User.DoesNotExist:
                pass

# Optional: Track when users are mentioned in messages
class MessageMention(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='mentions')
    mentioned_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentioned_in')
