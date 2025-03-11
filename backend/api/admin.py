from django.contrib import admin
from .models import Category, Tag, Forum, ForumMembership, Message, MessageMention
# Register your models here.
admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Forum)
admin.site.register(ForumMembership)
admin.site.register(Message)
admin.site.register(MessageMention)
