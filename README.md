# 🚀 FlashQuiz - Hệ Sinh Thái Học Tập Thông Minh

FlashQuiz là một nền tảng học tập trực tuyến toàn diện (LMS) được xây dựng để giúp người dùng tạo, quản lý và chia sẻ các tài nguyên giáo dục một cách hiệu quả và trực quan.

![FlashQuiz Banner](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Django-REST_Framework-green?style=for-the-badge&logo=django)
![Frontend](https://img.shields.io/badge/React-MUI-blue?style=for-the-badge&logo=react)

---

## ✨ Tính Năng Nổi Bật

### 📝 Hệ Thống Đề Thi & Ngân Hàng Câu Hỏi
- **Tạo Đề Thi Linh Hoạt:** Thiết lập thời gian làm bài, điểm đỗ và danh mục.
- **Ngân Hàng Câu Hỏi:** Quản lý câu hỏi tập trung, có thể tái sử dụng cho nhiều đề thi khác nhau.
- **Lịch Sử Làm Bài:** Theo dõi tiến độ và kết quả các bài thi đã thực hiện.

### 🗂️ Thẻ Ghi Nhớ (Flashcards)
- **Focus Study:** Chế độ học tập chuyên sâu với hiệu ứng lật thẻ 3D mượt mà.
- **Quản Lý Bộ Thẻ:** Tạo và tổ chức các bộ thẻ theo chủ đề cá nhân.

### 🌐 Diễn Đàn & Bài Viết (Forum)
- **Chia Sẻ Kiến Thức:** Đăng tải các bài viết giáo dục, hướng dẫn học tập.
- **Lọc Theo Chủ Đề:** Tìm kiếm nội dung dễ dàng thông qua hệ thống thẻ chủ đề.

### 🔒 Quyền Riêng Tư & Quản Lý Cá Nhân
- **Privacy Control:** Tùy chỉnh trạng thái "Công khai" hoặc "Chỉ mình tôi" cho Bài viết và Flashcards.
- **Trang Cá Nhân Chuyên Nghiệp:** Quản lý tập trung tất cả tài nguyên (Ngân hàng, Bài viết, Flashcards) trong một giao diện Tabs hiện đại.

### 🎨 Trải Nghiệm Người Dùng (UX/UI)
- **Chế Độ Sáng/Tối (Light/Dark Mode):** Bảo vệ mắt và tăng tính thẩm mỹ.
- **Thiết Kế Premium:** Giao diện Responsive, hiệu ứng chuyển cảnh mượt mà dựa trên Material UI.

---

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Framework:** Django & Django REST Framework (DRF)
- **Authentication:** JWT (JSON Web Token)
- **Database:** SQLite (Mặc định cho phát triển) / PostgreSQL

### Frontend
- **Library:** React.js (Vite)
- **UI Toolkit:** Material UI (MUI) v9+
- **Routing:** React Router v7
- **State Management:** Axios & React Hooks

---

## 🚀 Hướng Dẫn Cài Đặt

### 1. Cài Đặt Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Cài Đặt Frontend
```bash
cd frontend
npm install
npm run dev
```

Mặc định:
- Backend chạy tại: `http://127.0.0.1:8000`
- Frontend chạy tại: `http://localhost:5173`

---

## 📸 Ảnh Chụp Giao Diện
*(Vui lòng thêm ảnh screenshot vào đây)*

---

## 🤝 Đóng Góp
Mọi ý tưởng đóng góp hoặc báo lỗi vui lòng mở một **Issue** hoặc gửi **Pull Request**.

---

**Phát triển bởi Đội ngũ FlashQuiz 🚀**
