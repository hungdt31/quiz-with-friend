from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from domain.models import Topic, Article
from api.v1.serializers.blog import TopicSerializer, ArticleSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(tags=['Topics'])
class TopicViewSet(viewsets.ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

@extend_schema(tags=['Articles'])
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = Article.objects.all()
        if self.action == 'list':
            return qs.filter(is_public=True).order_by('-created_at')
            
        if user.is_authenticated:
            return qs.filter(Q(is_public=True) | Q(created_by=user)).order_by('-created_at')
        return qs.filter(is_public=True).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_articles(self, request, *args, **kwargs):
        qs = Article.objects.filter(created_by=request.user).order_by('-created_at')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
