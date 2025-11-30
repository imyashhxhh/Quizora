# Quizora - AI Quiz Generator

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Live Demo**: [https://quizora-ai-quiz-app.vercel.app/](https://quizora-ai-quiz-app.vercel.app/)

Quizora is a full-stack MERN application that leverages the power of generative AI to create interactive multiple-choice quizzes directly from user-uploaded PDF documents. It provides a seamless experience for both guests and registered users, featuring secure authentication and dynamic content generation.

## Features

-   **🤖 AI-Powered Quiz Generation**: Upload any One-page PDF document, and our backend will parse the text and use the Google Gemini API to generate a relevant, high-quality quiz.
-   **🔐 Secure User Authentication**: A complete authentication system with JWT-based sessions, allowing users to sign up, log in, and protect their data.
-   **🚀 Two User Flows**:
    -   **Guests**: Can try a sample quiz using pre-loaded questions to experience the platform.
    -   **Logged-in Users**: Can access the dashboard to upload PDFs and generate their own custom quizzes.
-   **✨ Modern Frontend**: A dynamic and responsive user interface built with React and styled with Tailwind CSS, featuring engaging GSAP animations.
-   **⚙️ Robust MERN Stack Backend**: A scalable backend built with Node.js and Express, connected to a MongoDB database.

---

## Tech Stack

| Category      | Technology                                |
| :------------ | :---------------------------------------- |
| **Frontend** | React.js, React Router, Redux Toolkit, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js                       |
| **Database** | MongoDB (with Mongoose)                   |
| **AI** | Google Gemini API                         |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js          |
| **Deployment**| Vercel (Frontend), Render (Backend), MongoDB Atlas (Database) |

---

### Prerequisites

-   Node.js (v18.0 or higher)
-   npm
-   Git

---

## Deployment

-   **Frontend**: Deployed on **Vercel**, connected to the `main` branch of the GitHub repository.
-   **Backend**: Deployed on **Render** as a Web Service, also connected to the `main` branch.
-   **Database**: A free-tier cluster hosted on **MongoDB Atlas**.
