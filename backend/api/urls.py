from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'forums', views.ForumViewSet, basename='forums')
router.register(r'forum-memberships', views.ForumMembershipViewSet, basename='forum-memberships')
router.register(r'messages', views.MessageViewSet, basename='messages')
router.register(r'message-mentions', views.MessageMentionViewSet, basename='message-mentions')

urlpatterns = [
    path('', include(router.urls)),
    path('categories', views.CategoryList.as_view()),
    path('tags', views.TagList.as_view()),
]