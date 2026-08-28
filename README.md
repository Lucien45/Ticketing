# 🎫 Ticketing

A modern full-stack ticket management system designed to manage customer support requests, track their progress, and facilitate communication between users and support administrators.

🔗 **Live Demo:** https://ticketing.demonstartion.co.uk/

---

## 📌 About the Project

Ticketing is a full-stack web application developed as a practical project to implement a complete support ticket management workflow.

Users can create and track support tickets, communicate through comments, and follow the resolution of their requests.

Administrators can manage tickets, assign them to support agents, update priorities and statuses, and monitor the overall activity through a dashboard.

The project focuses on clean architecture, REST API design, authentication, authorization, database relationships, caching, and frontend/backend integration.

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration
- User login
- JWT authentication
- Password hashing with bcrypt
- Protected routes
- Role-based authorization
- User profile management

### 🎫 Ticket Management

- Create tickets
- View tickets
- View ticket details
- Update tickets
- Delete tickets
- Assign tickets to administrators
- Change ticket status
- Change ticket priority

### 📊 Ticket Status

Tickets can have one of the following statuses:

- `OPEN`
- `IN_PROGRESS`
- `RESOLVED`
- `CLOSED`

### 🚨 Ticket Priority

- `LOW`
- `MEDIUM`
- `HIGH`
- `URGENT`

### 💬 Comments

Users and administrators can communicate through ticket comments.

- Add comments
- View conversation history
- Associate comments with users and tickets

### 🔎 Search & Filtering

The ticket list supports:

- Text search
- Status filtering
- Priority filtering
- Pagination
- Sorting

Example:

```http
GET /tickets?search=login&status=OPEN&priority=HIGH&page=1&limit=10
```

### 📈 Admin Dashboard

Administrators can view ticket statistics such as:

- Total tickets
- Open tickets
- Tickets in progress
- Resolved tickets
- Urgent tickets

### ⚡ Redis Caching

Redis is used to improve API performance by caching frequently requested data.

Examples:

```text
tickets:page:1:limit:10
tickets:stats
```

The cache is invalidated when relevant ticket data is modified.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      React App      │
                    │  Vite + TypeScript  │
                    └──────────┬──────────┘
                               │
                               │ HTTP / REST
                               ▼
                    ┌─────────────────────┐
                    │      NestJS API     │
                    │    REST + JWT       │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             ┌─────────────┐       ┌─────────────┐
             │ PostgreSQL  │       │    Redis    │
             │  Database   │       │    Cache    │
             └─────────────┘       └─────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- NestJS
- TypeScript
- TypeORM
- JWT
- bcrypt

### Database & Infrastructure

- PostgreSQL
- Redis

### Development

- Git
- GitHub
- REST API
- ESLint
- Prettier

---

## 📂 Project Structure

```text
ticketing/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── tickets/
│   │   ├── comments/
│   │   ├── cache/
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js 20+
- npm
- PostgreSQL
- Redis
- Git

---

## 📥 Installation

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd ticketing
```

### Backend

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Configure your environment variables:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=ticketing

JWT_SECRET=your_secret

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_TTL=3600
```

Start the development server:

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:5000
```

---

## 💻 Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 🔑 User Roles

### USER

A regular user can:

- Create tickets
- View their own tickets
- Add comments
- Follow ticket status
- Close their own tickets

### ADMIN

An administrator can:

- View all tickets
- Manage tickets
- Assign tickets
- Change priority
- Change status
- Delete tickets
- View statistics

---

## 🔌 API Overview

### Authentication

```http
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Tickets

```http
POST   /tickets
GET    /tickets
GET    /tickets/:id
PATCH  /tickets/:id
DELETE /tickets/:id
```

### Comments

```http
POST /tickets/:ticketId/comments
GET  /tickets/:ticketId/comments
```

### Statistics

```http
GET /tickets/stats
```

---

## 🧪 Testing

Run backend tests:

```bash
npm run test
```

Run tests with coverage:

```bash
npm run test:cov
```

---

## 🔒 Security

Security-related issues should not be reported through public GitHub issues.

Please follow the instructions described in [`SECURITY.md`](SECURITY.md).

---

## 🤝 Contributing

Contributions are welcome.

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before submitting a pull request.

---

## 📄 License

This project is licensed under the MIT License.

See [`LICENSE`](LICENSE) for more information.

---

## 👨‍💻 Author

**Savaka Lucien Rafaralahy**

Full-Stack Developer

- React
- TypeScript
- NestJS
- Node.js
- PostgreSQL
- Redis

---

⭐ If you find this project useful, consider giving it a star.