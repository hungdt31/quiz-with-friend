from rest_framework import viewsets, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from domain.models import Category, Quiz, Question, Answer, QuizAttempt, QuestionBank
from api.v1.serializers.quiz import CategorySerializer, QuizSerializer, QuestionSerializer, AnswerSerializer, QuizAttemptSerializer, QuestionBankSerializer
from services.quiz_services import QuizSubmissionService, QuizCreationService

@extend_schema(tags=['Categories'])
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

@extend_schema(tags=['Quizzes'])
class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all().order_by('-created_at')
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        if 'questions' in request.data:
            service = QuizCreationService(user=request.user, validated_data=request.data)
            quiz = service.execute()
            serializer = self.get_serializer(quiz)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "status": "success",
            "message": "Lấy danh sách các Bài Thi thành công!",
            "total_items": queryset.count(),
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "status": "success",
            "data": serializer.data
        })

    # Tính năng MỚI: API Endpoint Nộp bài thi
    # URL tạo ra sẽ là: POST /api/v1/quiz/quizzes/{id}/submit/
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None, **kwargs):
        # 1. Bảo mật: Cấm người ngoài đường (Chưa đăng nhập) vào nộp bài
        if not request.user.is_authenticated:
            return Response({"error": "Vui lòng Đăng Nhập (Truyền JWT Token) để nộp bài"}, status=status.HTTP_401_UNAUTHORIZED)
            
        submitted_answers = request.data.get('answers', {})
        if not submitted_answers:
            return Response({"error": "Gói dữ liệu answers bị rỗng"}, status=status.HTTP_400_BAD_REQUEST)
             
        try:
            # Khởi tạo Service Class và gọi execute()
            service = QuizSubmissionService(user=request.user, quiz_id=pk, submitted_answers=submitted_answers)
            result = service.execute()
            
            return Response({"status": "success", "result": result}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@extend_schema(tags=['Questions'])
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        bank_id = self.request.query_params.get('bank', None)
        if bank_id is not None:
            queryset = queryset.filter(bank_id=bank_id)
        return queryset

@extend_schema(tags=['Answers'])
class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

@extend_schema(tags=['Attempts'])
class QuizAttemptViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = QuizAttemptSerializer

    def get_queryset(self):
        # Trả về danh sách làm bài của chính User đang đăng nhập, xếp mới nhất lên đầu
        return QuizAttempt.objects.filter(user=self.request.user).order_by('-created_at')

@extend_schema(tags=['QuestionBanks'])
class QuestionBankViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionBankSerializer

    def get_queryset(self):
        return QuestionBank.objects.filter(created_by=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
