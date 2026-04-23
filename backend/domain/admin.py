from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Category, Quiz, Question, Answer, QuizAttempt, UserAnswer

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'is_premium', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('phone_number', 'avatar', 'is_premium')}),
    )

class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 4 

class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]
    list_display = ('text', 'category', 'difficulty', 'question_type')
    list_filter = ('category', 'difficulty', 'question_type')
    search_fields = ('text',)

class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_published', 'time_limit', 'created_at')
    list_filter = ('category', 'is_published')
    filter_horizontal = ('questions',) 
    search_fields = ('title',)

class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'score', 'passed', 'created_at')
    list_filter = ('passed', 'quiz')

class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ('attempt', 'question', 'is_correct')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Category)
admin.site.register(Quiz, QuizAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer)
admin.site.register(QuizAttempt, QuizAttemptAdmin)
admin.site.register(UserAnswer, UserAnswerAdmin)
