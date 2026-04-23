from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
        
    class Meta:
        verbose_name_plural = "Categories"

class QuestionBank(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='question_banks')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Question(models.Model):
    DIFFICULTY_CHOICES = (
        ('Easy', 'Dễ'),
        ('Medium', 'Trung bình'),
        ('Hard', 'Khó'),
    )
    TYPE_CHOICES = (
        ('Single', 'Một đáp án'),
        ('Multiple', 'Nhiều đáp án'),
    )
    
    category = models.ForeignKey(Category, related_name='questions', on_delete=models.SET_NULL, null=True, blank=True)
    bank = models.ForeignKey(QuestionBank, related_name='questions', on_delete=models.SET_NULL, null=True, blank=True, help_text="Thuộc ngân hàng câu hỏi nào")
    text = models.TextField()
    image_url = models.URLField(blank=True, null=True, help_text="Link hình ảnh minh hoạ (nếu có)")
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='Medium')
    question_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='Single')
    points = models.IntegerField(default=1, help_text="Điểm đạt được nếu trả lời đúng")
    
    def __str__(self):
        return f"[{self.difficulty}] {self.text[:50]}"

class Answer(models.Model):
    question = models.ForeignKey(Question, related_name='answers', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class Quiz(models.Model):
    title = models.CharField(max_length=255)
    category = models.ForeignKey(Category, related_name='quizzes', on_delete=models.SET_NULL, null=True) 
    questions = models.ManyToManyField(Question, related_name='quizzes', blank=True)
    description = models.TextField(blank=True, null=True)
    time_limit = models.IntegerField(default=30, help_text="Thời gian làm bài (Phút)")
    passing_score = models.IntegerField(default=50, help_text="Điểm qua môn (%)")
    is_published = models.BooleanField(default=False, help_text="Cho phép học sinh thấy và thi")
    shuffle_questions = models.BooleanField(default=False, help_text="Đảo câu hỏi khi vào thi")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_quizzes')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Quizzes"
