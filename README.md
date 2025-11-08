EPROJECT-PHASE-1 – Microservices Architecture
1️⃣ Thông tin sinh viên

Họ và tên: Phạm Trọng Thuần

Mã sinh viên: 22691391

Môn học: E-Project

Giảng viên hướng dẫn: (điền tên giảng viên)

Lớp: (điền lớp học)

2️⃣ Hệ thống giải quyết vấn đề gì?

Hệ thống được xây dựng để mô phỏng nền tảng thương mại điện tử thu nhỏ, với 3 nghiệp vụ chính:

Quản lý người dùng: đăng ký, đăng nhập, xác thực, phân quyền truy cập.

Quản lý sản phẩm: tạo, xem, sửa, xóa sản phẩm.

Quản lý đơn hàng: xử lý đơn hàng, lưu trữ và phản hồi trạng thái đơn hàng.

3️⃣ Hệ thống gồm bao nhiêu dịch vụ?

Hệ thống tuân theo kiến trúc Microservices, được chia thành 4 dịch vụ chính:

STT	Dịch vụ	Chức năng
1	auth (Authentication Service)	Quản lý người dùng, xác thực JWT
2	product (Product Service)	Quản lý sản phẩm, gửi thông tin đơn hàng
3	order (Order Service)	Nhận thông tin đơn hàng, xử lý đơn hàng
4	api-gateway (API Gateway)	Cổng vào duy nhất của hệ thống, định tuyến đến các service khác
4️⃣ Ý nghĩa từng dịch vụ

auth
→ Đăng ký, đăng nhập, xác thực tài khoản người dùng.
→ Quản lý JWT Token để bảo mật API.

product
→ Quản lý danh mục sản phẩm.
→ Khi người dùng đặt hàng, product service gửi thông tin đơn hàng sang order service.

order
→ Tiếp nhận đơn hàng từ product service.
→ Thực hiện logic đặt hàng, lưu vào MongoDB, trả kết quả lại.

api-gateway
→ Là điểm truy cập duy nhất (Single Entry Point) cho client.
→ Thực hiện định tuyến (routing), xác thực token, logging request.

5️⃣ Các thành phần thiết kế sử dụng

API Gateway Pattern:
→ Mọi request từ client đi qua gateway, giúp tách biệt logic từng service.

Database per Service Pattern:
→ Mỗi service có cơ sở dữ liệu MongoDB riêng, đảm bảo tính độc lập dữ liệu và dễ mở rộng.

Service Communication:
→ Các service giao tiếp qua HTTP REST API và RabbitMQ (nếu bật bất đồng bộ).

6️⃣ Cách các dịch vụ giao tiếp
Giao tiếp	Mô tả
API Gateway → Services	Gateway định tuyến request đến đúng service (auth, product, order).
auth → client/product	Khi người dùng đăng nhập, auth trả token cho client để dùng cho các request sau.
product → order	Gửi thông tin đơn hàng mới qua RabbitMQ (publish message).
order → product	Sau khi xử lý đơn hàng, order có thể gửi trạng thái ngược lại cho product (publish lại message).
7️⃣ Công nghệ sử dụng

Node.js – môi trường chạy JavaScript phía server

Express.js – framework backend

MongoDB + Mongoose – cơ sở dữ liệu NoSQL

Postman – kiểm thử API

RabbitMQ (optional) – hàng đợi tin nhắn giữa các service

Docker Compose (optional) – container hóa hệ thống

GitHub Actions (optional) – CI/CD pipeline

8️⃣ Cấu trúc thư mục tổng thể
EPROJECT-PHASE-1/
│
├─ api-gateway/
│  ├─ src/
│  │  ├─ routes/
│  │  ├─ middlewares/
│  │  └─ app.js
│  ├─ .env
│  └─ package.json
│
├─ auth/
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ models/
│  │  ├─ routes/
│  │  └─ app.js
│  ├─ .env
│  └─ package.json
│
├─ product/
│  ├─ src/
│  │  ├─ controllers/
│  │  │  └─ productController.js
│  │  ├─ routes/
│  │  │  └─ productRoutes.js
│  │  ├─ models/
│  │  ├─ services/
│  │  └─ app.js
│  ├─ .env
│  └─ package.json
│
├─ order/
│  ├─ src/
│  │  ├─ controllers/
│  │  ├─ models/
│  │  ├─ routes/
│  │  └─ app.js
│  ├─ .env
│  └─ package.json
│
├─ docker-compose.yml
└─ README.md

9️⃣ Cấu hình môi trường (.env mẫu)
API Gateway
PORT=5000
AUTH_SERVICE_URL=http://localhost:5001
PRODUCT_SERVICE_URL=http://localhost:5002
ORDER_SERVICE_URL=http://localhost:5003

Auth Service
PORT=5001
MONGODB_URI=mongodb://localhost:27017/auth_service
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

Product Service
PORT=5002
MONGODB_URI=mongodb://localhost:27017/product_service
AUTH_SERVICE_URL=http://localhost:5001
RABBITMQ_URL=amqp://localhost

Order Service
PORT=5003
MONGODB_URI=mongodb://localhost:27017/order_service
PRODUCT_SERVICE_URL=http://localhost:5002
RABBITMQ_URL=amqp://localhost

🔟 Cách chạy hệ thống
1. Cài dependencies
npm install

2. Chạy từng service
cd api-gateway && npm start
cd auth && npm start
cd product && npm start
cd order && npm start


Hoặc nếu dùng Docker Compose:

docker compose up --build