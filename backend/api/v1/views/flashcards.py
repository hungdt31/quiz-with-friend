from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from domain.models import FlashcardSet, Flashcard
from api.v1.serializers.flashcards import FlashcardSetSerializer, FlashcardSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(tags=['FlashcardSets'])
class FlashcardSetViewSet(viewsets.ModelViewSet):
    queryset = FlashcardSet.objects.all()
    serializer_class = FlashcardSetSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs = FlashcardSet.objects.all()
        if self.action == 'list':
            return qs.filter(is_public=True).order_by('-created_at')
            
        if user.is_authenticated:
            return qs.filter(Q(is_public=True) | Q(created_by=user)).order_by('-created_at')
        return qs.filter(is_public=True).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
        
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_sets(self, request, *args, **kwargs):
        qs = FlashcardSet.objects.filter(created_by=request.user).order_by('-created_at')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

@extend_schema(tags=['Flashcards'])
class FlashcardViewSet(viewsets.ModelViewSet):
    queryset = Flashcard.objects.all()
    serializer_class = FlashcardSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
