from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.v1.views.quiz import CategoryViewSet, QuizViewSet, QuestionViewSet, AnswerViewSet, QuizAttemptViewSet, QuestionBankViewSet
from api.v1.views.users import RegisterView
from api.v1.views.blog import TopicViewSet, ArticleViewSet
from api.v1.views.flashcards import FlashcardSetViewSet, FlashcardViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'quizzes', QuizViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'answers', AnswerViewSet)
router.register(r'attempts', QuizAttemptViewSet, basename='attempt')
router.register(r'question-banks', QuestionBankViewSet, basename='question-bank')

router.register(r'topics', TopicViewSet)
router.register(r'articles', ArticleViewSet)
router.register(r'flashcard-sets', FlashcardSetViewSet)
router.register(r'flashcards', FlashcardViewSet)

urlpatterns = [
    path('quiz/', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
