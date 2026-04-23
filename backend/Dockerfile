# Sử dụng Python image bản chính thức
FROM python:3.11-slim

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy requirement file và cài đặt thư viện
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code vào không gian làm việc
COPY . .

# Hugging Face yêu cầu ứng dụng phải chạy trên cổng 7860
ENV PORT=7860

# Mở cổng 7860
EXPOSE 7860

# Lệnh khởi chạy server (sử dụng gunicorn cho production)
CMD gunicorn core.wsgi:application --bind 0.0.0.0:7860
