from django.core.management.base import BaseCommand
from domain.models import Category, Quiz, Question, Answer

class Command(BaseCommand):
    help = 'Tạo dữ liệu mẫu (Seeding) cho hệ thống Quiz'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Xóa dữ liệu cũ để tránh trùng lặp nếu chạy nhiều lần
        Category.objects.all().delete()
        
        # 1. Tạo Danh Mục (Category)
        cat_toan = Category.objects.create(name='Toán Học', description='Các bài toán Logic và tính toán')
        cat_anh = Category.objects.create(name='Tiếng Anh', description='Ngữ pháp và từ vựng cơ bản')

        # 2. Tạo Câu Hỏi (Question) & Đáp án (Answer) cho Toán
        q1 = Question.objects.create(
            category=cat_toan,
            text='1 + 1 bằng mấy?',
            difficulty='Easy',
            question_type='Single',
            points=5
        )
        Answer.objects.create(question=q1, text='2', is_correct=True)
        Answer.objects.create(question=q1, text='3', is_correct=False)
        Answer.objects.create(question=q1, text='4', is_correct=False)

        q2 = Question.objects.create(
            category=cat_toan,
            text='Đạo hàm của x^2 là gì?',
            difficulty='Medium',
            question_type='Single',
            points=10
        )
        Answer.objects.create(question=q2, text='2x', is_correct=True)
        Answer.objects.create(question=q2, text='x', is_correct=False)
        Answer.objects.create(question=q2, text='2', is_correct=False)

        # 3. Tạo Câu Hỏi (Question) & Đáp án (Answer) cho Tiếng Anh
        q3 = Question.objects.create(
            category=cat_anh,
            text='Từ nào sau đây là danh từ?',
            difficulty='Medium',
            question_type='Single',
            points=10
        )
        Answer.objects.create(question=q3, text='Run', is_correct=False)
        Answer.objects.create(question=q3, text='Beautiful', is_correct=False)
        Answer.objects.create(question=q3, text='Apple', is_correct=True)

        q4 = Question.objects.create(
            category=cat_anh,
            text='Trái nghĩa với "Hot" là gì?',
            difficulty='Easy',
            question_type='Single',
            points=5
        )
        Answer.objects.create(question=q4, text='Cold', is_correct=True)
        Answer.objects.create(question=q4, text='Warm', is_correct=False)

        # 4. Tạo Bài Thi (Quiz)
        quiz_toan = Quiz.objects.create(
            title='Bài kiểm tra Toán 15 phút',
            category=cat_toan,
            time_limit=15,
            passing_score=50,
            is_published=True
        )
        # Nối câu hỏi vào đề thi
        quiz_toan.questions.add(q1, q2)

        quiz_anh = Quiz.objects.create(
            title='Bài kiểm tra Tiếng Anh đầu vào',
            category=cat_anh,
            time_limit=30,
            passing_score=60,
            is_published=True,
            shuffle_questions=True
        )
        quiz_anh.questions.add(q3, q4)

        # Bài thi Trộn (Mix) để biểu diễn sức mạnh của M2M (Tái sử dụng câu hỏi)
        quiz_mix = Quiz.objects.create(
            title='Đề Tổng Hợp IQ Thử Thách',
            category=None,
            time_limit=45,
            passing_score=80,
            is_published=True
        )
        quiz_mix.questions.add(q2, q3)

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database!'))
