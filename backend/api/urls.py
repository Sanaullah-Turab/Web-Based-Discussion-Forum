from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'forums', views.ForumViewSet, basename='forums')

urlpatterns = [
    path('', include(router.urls)),
    path('categories', views.CategoryList.as_view()),
    path('tags', views.TagList.as_view()),
]