# TrainNote

Web application to log workouts, meals, body weight, and track a person's fitness progress. It also allows generating personalized training or nutrition plans using artificial intelligence.

## Description

TrainNote is a platform where users can create an account and manage all their fitness information in one place.

Users can log their daily workouts, including exercises, sets, reps, weight used, and duration.

They can also log their meals, calories, protein, carbohydrates, and fats, as well as keep track of their body weight.

The application uses the logged data to display the user's progress through statistics and charts.

TrainNote also allows generating personalized plans with artificial intelligence. The user can choose between a training plan or a nutrition plan and fill in the required data to get a recommendation tailored to their goals.

## Features

- User registration.
- Login.
- JWT-based authentication.
- Password recovery.
- View and update profile.
- Workout logging.
- Logging of exercises, sets, reps, and weight used.
- Meal logging.
- Body weight logging.
- Progress tracking.
- Weight evolution charts.
- Record history lookup.
- AI-generated training plans.
- AI-generated nutrition plans.

## Technologies used

### Frontend

- **React** — main library for building the interface.
- **React Router DOM** — routing and navigation.
- **Tailwind CSS** — styling and responsive design.
- **Recharts** — weight evolution and progress charts.
- **Material Symbols (Google Fonts)** — UI iconography.
- **Cloudinary** — storage and delivery of profile images (avatar upload).
- **Context API / useReducer (Flux pattern)** — global application state management.

### Backend

- **Python 3**
- **Flask** — main server framework and route definitions (Blueprints).
- **Flask-SQLAlchemy** — ORM for database handling.
- **Flask-JWT-Extended** — authentication and JWT token handling.
- **Flask-CORS** — cross-origin access policy handling between frontend and backend.
- **Werkzeug** — secure password hashing and verification.
- **Google Gemini API (google-genai)** — AI-generated training and nutrition plans.
- **smtplib / Gmail SMTP** — password recovery emails.
- **Pipenv** — virtual environment and dependency management.

### Database

- **PostgreSQL**

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/4GeeksAcademy/TrainNote
cd TrainNote
```

### 2. Install backend dependencies

```bash
pipenv install
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Set up environment variables

Create a `.env` file in the project root with the following variables:

```env
# Backend
GEMINI_API_KEY=your_key
MAIL_USERNAME=youremail@gmail.com
MAIL_PASSWORD=your_key
JWT_SECRET_KEY=your_key

# Frontend
VITE_BASENAME=/
VITE_BACKEND_URL=https://your-backend-url
BACKEND_URL=https://your-backend-url
VITE_CLOUDINARY_CLOUD_NAME=your_key
```

> **Note:** `MAIL_PASSWORD` must be a [Google app password](https://support.google.com/accounts/answer/185833), not your regular Gmail account password.

## Running the project

Backend:

```bash
pipenv run start
```

Frontend:

```bash
npm run start
```
