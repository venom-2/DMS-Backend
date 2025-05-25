# Course Outcome Management System (COMS) – Backend

This is the **backend server** for the **Course Outcome Management System (COMS)** project. It is responsible for handling all API requests and business logic for the COMS frontend, which is deployed on Vercel for testing purposes.

> 🔗 Frontend Repository: [COMS Frontend](https://github.com/venom-2/COMS-IMSEC)  
> 🌐 Test Deployment: [COMS Frontend on Vercel](https://coms-imsec-frontend.vercel.app/)

---

## 🧠 Overview

COMS is designed to streamline the process of managing and evaluating course outcomes (COs) for academic institutions. This backend provides secure endpoints for:

- Managing faculties, subjects, and course mappings
- Calculating and storing Course Outcome data
- Role-based authentication and authorization (Admin, Faculty, HoD)
- Uploading marks, mapping with COs, and generating reports

---

## ⚙️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (via pg)
- **Authentication:** JWT (JSON Web Tokens)
- **CORS Enabled** for communication with the frontend
- **Multer** for file uploads (e.g., Excel)
- **Environment Variables:** Managed using `.env`

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.x
- PostgreSQL (local or remote)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/venom-2/DMS-Backend.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create and configure `.env`:**
   ```bash
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/coms_db
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://your-vercel-frontend.vercel.app
   ```
5. **Start the server:**
   ```bash
   npm start
   ```

## 👨‍💻 Maintained by
   - Akshat Trivedi
   - Dept. of Computer Science
   - IMS Engineering College
