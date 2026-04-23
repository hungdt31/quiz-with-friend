from django.db import models
from django.conf import settings
from .quiz import Quiz, Question, Answer

class QuizAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='attempts', on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, related_name='attempts', on_delete=models.CASCADE)
    score = models.IntegerField(default=0, help_text="Tổng điểm đạt được")
    passed = models.BooleanField(default=False, help_text="Đạt/Trượt")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - Điểm: {self.score}"

class UserAnswer(models.Model):
    attempt = models.ForeignKey(QuizAttempt, related_name='user_answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.ForeignKey(Answer, on_delete=models.CASCADE, null=True, blank=True)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.attempt.user.username} - {self.question.text[:20]}"
