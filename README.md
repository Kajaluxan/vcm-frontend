# 📹 Video Content Management (VCM) Platform

A full-stack, serverless web application for managing video and PDF content with secure cloud storage, admin moderation, and user authentication.

## 🔍 Overview

The VCM Platform allows users to upload large video files and documents, while administrators can approve, rename, or delete content through a dedicated admin panel. Built using modern web technologies, the platform leverages AWS S3 for storage and AWS Lambda for backend scalability.

## ✨ Key Features

- 🔐 JWT-based user authentication
- ☁️ Large file upload via AWS S3 pre-signed URLs
- 👨‍💼 Admin panel for content approval and moderation
- 📄 Supports both video and PDF uploads
- 📦 PostgreSQL for user and file metadata
- ⚡ Serverless backend with AWS Lambda & API Gateway
- ⚛️ React frontend with Axios for API integration

## 🛠 Tech Stack

| Layer         | Technology                              |
|---------------|------------------------------------------|
| Frontend      | React, Vite, CSS                         |
| Backend       | Node.js, Express.js                      |
| Database      | PostgreSQL                               |
| Cloud Storage | AWS S3 (pre-signed URL based uploads)    |
| Serverless    | AWS Lambda, API Gateway                  |
| Auth          | JSON Web Tokens (JWT)                    |
| Tools         | Git, Postman                             |

## 🔗 Backend Repository
- [GitHub – vcm-backend](https://github.com/Kajaluxan/vcm-backend.git)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<username>/<repo-name>.git
```

### 2. Install Dependencies
#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3. Environment Setup

Create `.env` files in both `frontend` and `backend` folders.

#### Example `.env` (backend)
```env
PORT=5000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_password
DB_NAME=your_database
AWS_REGION=your_region
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET_NAME=your_bucket_name
```

### 4. Run the App Locally
#### Backend
```bash
cd backend
node index.js
```

#### Frontend
```bash
cd frontend
npm run dev
```

## 📁 Project Structure

```

backend/         # Express.js API
frontend/        # React app (Vite)
README.md
```


## 📄 License

This project is licensed under the MIT License.
