# CollegeFinder

> One-stop personalized career and education advisor for students exploring streams, colleges, and future pathways.

![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Backend-Express_5-111111?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

## Overview

`CollegeFinder` is a full-stack platform built to help students make better education and career decisions with less confusion. It combines:

- verified user onboarding
- aptitude-style AI-generated tests
- score-based suggestions
- college discovery with filters
- session-aware authentication
- profile and activity management

The app is especially geared toward students in Class 10 and Class 12 who want structured guidance on streams, colleges, and next steps.

## What It Does

### Student Experience

- Register, verify email, and sign in securely
- Take AI-generated aptitude or interest-based tests
- View submitted test results and score breakdowns
- Explore suggested colleges based on performance and state preference
- Browse college listings with search, pagination, and filters
- Manage profile, password, and active sessions

### Platform Features

- JWT-based auth with access and refresh tokens
- Cookie-based session persistence
- Email verification and password reset workflows
- MongoDB-powered user, college, test, and result storage
- Gemini-powered test generation
- External recommendation-model integration for college suggestions

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- shadcn UI
- Axios
- Framer Motion

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT authentication
- Nodemailer / Brevo email integration
- Google Generative AI SDK

## Monorepo Structure

```text
CollegeFinder/
|- backend/    # Express API, MongoDB models, auth, test engine, college APIs
|- frontend/   # React app, routes, pages, contexts, UI components
`- README.md
```

## Key Modules

### Frontend Highlights

- Public pages: home, about, contact, how-it-works
- Auth flows: register, verify, login, forgot/reset password
- Protected pages: dashboard, profile, sessions
- Test flow: create test, continue running test, submit, view result
- College flow: find colleges, inspect college details, get suggestions

### Backend Highlights

- `/api/v1/auth` for onboarding and session auth
- `/api/v1/user` for user account operations
- `/api/v1/password` for password recovery and change flows
- `/api/v1/colleges` for listing, filtering, CRUD, and recommendations
- `/api/v1/test` for AI test generation, progress, submission, and history

## Local Development

### 1. Clone and install dependencies

```powershell
git clone <your-repo-url>
cd CollegeFinder

cd backend
npm install

cd ..\frontend
npm install
```

### 2. Create environment files

Create `backend/.env` and `frontend/.env`.

#### `backend/.env`

```env
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb://127.0.0.1:27017
DB_NAME=collegefinder

ACCESS_TOKEN_SECRET=replace_with_secure_value
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=replace_with_secure_value
REFRESH_TOKEN_EXPIRY=7d

EMAIL_ENABLED=false
EMAIL_SENDER_NAME=CollegeFinder
EMAIL_SENDER_ADDRESS=your-email@example.com
BREVO_API_KEY=your_brevo_key

GEMINI_API_KEY=your_gemini_api_key
```

#### `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 3. Start both apps

In one terminal:

```powershell
cd backend
npm run dev
```

In another terminal:

```powershell
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

Backend runs on `http://localhost:8000` by default.

Health check:

```text
GET /api/v1/health-check
```

## API Snapshot

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/verify/:token`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/logout-all`

### Colleges

- `GET /api/v1/colleges`
- `GET /api/v1/colleges/filters`
- `GET /api/v1/colleges/:id`
- `POST /api/v1/colleges/college-suggestion`

### Tests

- `POST /api/v1/test/build`
- `GET /api/v1/test`
- `POST /api/v1/test/submit`
- `GET /api/v1/test/history`
- `GET /api/v1/test/:testId`

## Deployment References

- App: `https://college-finder-advisor.onrender.com`
- Recommendation model: `https://one-stop-personalized-career-education-h92r.onrender.com/recommend`

## Notes

- Email sending is controlled through `EMAIL_ENABLED`.
- Auth uses cookies with `withCredentials: true` on the frontend.
- The recommendation service is an external model endpoint and may take time to warm up if hosted on Render.
- No proper automated test suite is configured yet in the current repo.
