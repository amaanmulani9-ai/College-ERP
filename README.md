<div align="center">


# 🎓 College ERP System 🚀
**A Next-Generation Enterprise Resource Planning Solution for Educational Institutions**

[![Python Version](https://img.shields.io/badge/Python-3.8+-blue.svg?style=for-the-badge&logo=python)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.x-092E20.svg?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Author](https://img.shields.io/badge/Developer-Amaan-purple.svg?style=for-the-badge)](https://github.com/amaanmulani9-ai)

*Streamline administration, empower staff, and engage students with a single unified platform.*

[Report a Bug](https://github.com/amaanmulani9-ai/College-ERP/issues) • [Request Feature](https://github.com/amaanmulani9-ai/College-ERP/issues)

</div>

---

## 🌟 Overview

**College ERP** is a full-stack educational management system built using the powerful Django web framework. It bridges the gap between Administration, Staff, and Students by providing real-time data synchronization, dynamic dashboards, and automated workflows.

Whether you're managing attendance, tracking academic results, or handling leave requests, College ERP provides an intuitive, glassmorphic UI that feels premium and responsive on any device.

---

## 📸 Screenshots

Here are some glimpses of the **College ERP** in action:

| Login Portal | Admin Dashboard |
|:---:|:---:|
| ![Login Page](Showcase/Screenshot_01.png) | ![Admin Dashboard](Showcase/Screenshot_02.png) |

| Staff Portal | Student Portal |
|:---:|:---:|
| ![Staff Dashboard](Showcase/Screenshot_03.png) | ![Student Dashboard](Showcase/Screenshot_04.png) |

---

## 🔥 Key Features

### 👨‍💼 Administration Portal
- **Global Dashboard:** View real-time analytics on student enrollment, staff counts, and course metrics.
- **Academic Management:** Create and manage Courses, Subjects, and Academic Sessions.
- **User Management:** Full CRUD capabilities for Staff, Student, and Parent accounts.
- **Oversight:** Monitor attendance, review leave applications, and process user feedback.
- **Financials & Placements:** Manage student fees, generate receipts, and organize campus placement drives.
- **Document Management:** Securely upload and distribute general college documents.

### 👨‍🏫 Staff Portal
- **Attendance Tracking:** Quickly take, update, and manage student attendance.
- **Academic Grading:** Publish and edit student results securely.
- **Online Exams:** Create, schedule, and grade automated MCQ exams.
- **Library Management:** Issue books to students and track library inventory.
- **Communication:** Apply for staff leave and send direct feedback to the Administration.

### 🎓 Student Portal
- **Academic Dashboard:** View personalized timetables, attendance records, offline results, and online exam scores.
- **Online Examinations:** Take secure, timed MCQ online exams directly from the portal.
- **AI Study Assistant:** Get instant help with studying and generate practice quizzes using an integrated AI bot.
- **Library Access:** Browse the library catalog and track borrowed books.
- **Requests:** Submit leave applications and request official certificates directly from the dashboard.
- **Finances:** Track fee structures and log fee payments.

### 👪 Parent Portal
- **Child Progress:** Securely log in to monitor linked student's academic progress.
- **Real-time Analytics:** View attendance metrics, offline test scores, and online exam submissions.

### 🌐 Global Features
- **PWA Ready:** Installable on desktop and mobile devices for offline access and native app-like experience.
- **Multi-Language (i18n):** Dynamically switch the interface between English, Hindi, and Arabic.


---

## 💻 Tech Stack

- **Backend:** Python, Django
- **Frontend:** HTML5, CSS3 (Custom Glassmorphism Design), JavaScript, Bootstrap 5
- **Database:** SQLite3 (Development) / PostgreSQL (Production)
- **Security:** CSRF Protection, Password Hashing, Role-Based Access Control

---

## 🚀 Getting Started

Follow these steps to get a local copy up and running on your machine.

### Prerequisites
Make sure you have [Python 3.8+](https://www.python.org/downloads/) installed on your system.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amaanmulani9-ai/College-ERP.git
   cd College-ERP
   ```

2. **Create a virtual environment (Recommended)**
   ```bash
   python -m venv venv
   # Activate on Windows:
   venv\Scripts\activate
   # Activate on macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a Superuser (Admin Account)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:8000`.

---

## 🔐 Default Demo Accounts

If you have seeded the database with test data, you can use the following default accounts to explore the system:

| Role | Email Address | Password |
|------|---------------|----------|
| **Staff** | `staffone@staff.com` | `staffone` |
| **Student** | `studentone@student.com` | `studentone` |

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <b>Built with ❤️ by <a href="https://github.com/amaanmulani9-ai">Amaan</a></b><br>
  <i>If you find this project helpful, please consider giving it a ⭐!</i>
</div>
