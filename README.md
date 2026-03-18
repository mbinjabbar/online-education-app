# 📚 EduStream — Online Education Platform

> A full-stack online education platform for managing subjects, video content, and learners — built with Angular & Node.js.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Best Practices](#-best-practices-used)
- [Contributing](#-contributing)
- [Author](#-author)
- [Support](#-support)

---

## 🚀 Features

- 🔐 **JWT Authentication** — Secure login & registration with token-based auth
- 👤 **User Profile Management** — Update and manage learner/instructor profiles
- 📚 **Subject CRUD** — Create, read, update, and delete educational subjects
- 🎥 **Video Upload & Management** — Upload and manage course video content
- 🛡️ **Validation & Error Handling** — Centralized, consistent error responses
- 📦 **File Uploads** — Handled via Multer with Supabase storage integration
- 🔒 **Secure Password Hashing** — bcrypt-powered credential security
- ⚡ **Clean, Scalable Architecture** — MVC pattern with separated concerns

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Angular, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Auth** | JSON Web Tokens (JWT) |
| **File Storage** | Multer + Supabase |
| **Security** | bcrypt |

---

## 📁 Project Structure

```
online-education-app/
├── frontend/               # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   └── models/
│   │   └── environments/
│   └── package.json
│
└── backend/                # Node.js + Express API
    ├── controllers/
    ├── routes/
    ├── middleware/
    ├── models/
    ├── config/
    └── package.json
```

---

## 🏁 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or above)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
- [MySQL](https://www.mysql.com/) (running locally or remotely)
- A [Supabase](https://supabase.com/) account (for file storage)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/mbinjabbar/online-education-app
cd online-education-app
```

**2. Set up the Backend**

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#-environment-variables) below), then start the server:

```bash
npm run dev
```

The API will be running at `http://localhost:3000`.

**3. Set up the Frontend**

Open a new terminal:

```bash
cd frontend
npm install
ng serve --open
```

The app will be available at `http://localhost:4200`.

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```env
# Server
PORT=3000

# Database
DATABASE_URL=mysql://root:@localhost:3306/YOUR_DB_NAME

# Auth
JWT_SECRET=your_super_secret_key_here

# Supabase (for file uploads)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
```

> ⚠️ Never commit your `.env` file. Add it to `.gitignore`.

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT | ❌ |
| `GET` | `/api/profile` | Get user profile | ✅ |
| `PUT` | `/api/profile` | Update user profile | ✅ |
| `GET` | `/api/subjects` | List all subjects | ✅ |
| `POST` | `/api/subjects` | Create a subject | ✅ |
| `PUT` | `/api/subjects/:id` | Update a subject | ✅ |
| `DELETE` | `/api/subjects/:id` | Delete a subject | ✅ |
| `POST` | `/api/videos/upload` | Upload a video | ✅ |
| `GET` | `/api/videos/:subjectId` | Get videos by subject | ✅ |

> Full API documentation coming soon.

---

## 🧠 Best Practices Used

- **MVC Architecture** — Clear separation of Models, Views, and Controllers
- **Middleware Separation** — Auth, validation, and error handling as dedicated middleware
- **Centralized Error Handling** — Consistent error format across all endpoints
- **Secure Password Hashing** — bcrypt with salt rounds for credential security
- **JWT Authentication** — Stateless, scalable token-based auth
- **Environment-based Config** — Sensitive data kept out of source code via `.env`
- **Clean REST API Design** — Predictable, resource-oriented endpoints

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing architecture and includes appropriate error handling.

---

## 👨‍💻 Author

**Muhammad Bin Jabbar**

- GitHub: [@mbinjabbar](https://github.com/mbinjabbar)

---

## ⭐ Support

If you find this project useful, please consider giving it a ⭐ on [GitHub](https://github.com/mbinjabbar/online-education-app) — it helps a lot!

---

<p align="center">Made with ❤️ by <a href="https://github.com/mbinjabbar">Muhammad Bin Jabbar</a></p>