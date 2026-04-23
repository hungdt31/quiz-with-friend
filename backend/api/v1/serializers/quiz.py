from rest_framework import serializers
from domain.models import Category, Quiz, Question, Answer, QuizAttempt, QuestionBank

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    answers_data = serializers.ListField(child=serializers.DictField(), write_only=True, required=False)

    class Meta:
        model = Question
        fields = ['id', 'text', 'image_url', 'difficulty', 'question_type', 'points', 'category', 'category_name', 'bank', 'answers', 'answers_data']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers_data', [])
        question = Question.objects.create(**validated_data)
        for answer_data in answers_data:
            Answer.objects.create(
                question=question, 
                text=answer_data.get('text'), 
                is_correct=answer_data.get('is_correct', False)
            )
        return question

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    creator_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'category', 'category_name', 'description', 'time_limit', 'passing_score', 'is_published', 'shuffle_questions', 'created_at', 'questions', 'creator_name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = ['id', 'quiz', 'quiz_title', 'score', 'passed', 'created_at']

class QuestionBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionBank
        fields = ['id', 'name', 'description', 'created_at']
