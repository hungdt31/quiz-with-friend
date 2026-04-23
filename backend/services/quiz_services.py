from django.db import transaction
from domain.models import Quiz, QuizAttempt, UserAnswer, Answer, Question

class QuizCreationService:
    def __init__(self, user, validated_data):
        self.user = user
        self.validated_data = validated_data

    def execute(self):
        with transaction.atomic():
            quiz_data = {
                'title': self.validated_data.get('title'),
                'description': self.validated_data.get('description', ''),
                'category_id': self.validated_data.get('category'),
                'time_limit': self.validated_data.get('time_limit', 30),
                'passing_score': self.validated_data.get('passing_score', 50),
                'is_published': self.validated_data.get('is_published', True),
                'created_by': self.user
            }
            quiz = Quiz.objects.create(**quiz_data)
            
            existing_questions = self.validated_data.get('existing_question_ids', [])
            if existing_questions:
                quiz.questions.add(*existing_questions)

            questions_data = self.validated_data.get('questions', [])
            for q_data in questions_data:
                question = Question.objects.create(
                    category_id=self.validated_data.get('category'),
                    bank_id=q_data.get('bank_id'),
                    text=q_data.get('text'),
                    points=q_data.get('points', 1)
                )
                
                answers_data = q_data.get('answers', [])
                for a_data in answers_data:
                    Answer.objects.create(
                        question=question,
                        text=a_data.get('text'),
                        is_correct=a_data.get('is_correct', False)
                    )
                
                quiz.questions.add(question)
                
            return quiz

class QuizSubmissionService:
    """
    Service Class chuyên trách xử lý Logic: Nộp bài thi và Tính điểm
    """
    def __init__(self, user, quiz_id, submitted_answers):
        self.user = user
        self.quiz = Quiz.objects.get(id=quiz_id)
        self.submitted_answers = submitted_answers
        self.questions = self.quiz.questions.all()
        
        # Các biến trạng thái
        self.total_score = 0
        self.total_possible_score = sum(q.points for q in self.questions)
        self.attempt = None

    def execute(self):
        """Hàm công khai duy nhất để gọi từ bên ngoài"""
        self._create_attempt()
        self._process_answers()
        return self._finalize_attempt()

    def _create_attempt(self):
        """Khởi tạo một Lượt thi rỗng cho Học sinh"""
        self.attempt = QuizAttempt.objects.create(user=self.user, quiz=self.quiz)

    def _process_answers(self):
        """Duyệt qua từng câu hỏi trong đề để chấm điểm"""
        for question in self.questions:
            selected_answer_id = self.submitted_answers.get(str(question.id))
            is_correct = False
            selected_answer = None
            
            if selected_answer_id:
                try:
                    selected_answer = Answer.objects.get(id=selected_answer_id, question=question)
                    if selected_answer.is_correct:
                        is_correct = True
                        self.total_score += question.points
                except Answer.DoesNotExist:
                    pass

            # Lưu lại lịch sử Câu Trả Lời
            UserAnswer.objects.create(
                attempt=self.attempt,
                question=question,
                selected_answer=selected_answer,
                is_correct=is_correct
            )

    def _finalize_attempt(self):
        """Tính toán kết quả Cuối Cùng và cập nhật Database"""
        percentage = (self.total_score / self.total_possible_score * 100) if self.total_possible_score > 0 else 0
        passed = percentage >= self.quiz.passing_score
        
        self.attempt.score = self.total_score
        self.attempt.passed = passed
        self.attempt.save()
        
        return {
            "attempt_id": self.attempt.id,
            "score": self.total_score,
            "total_possible": self.total_possible_score,
            "percentage": round(percentage, 2),
            "passed": passed
        }
