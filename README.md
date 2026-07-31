# Smart Care

A demo healthcare web app with a symptom analysis experience, risk assessment flow, role-based dashboards, and a basic auth backend.

## What it includes
- Landing page with healthcare product storytelling
- Login and signup pages for patients, doctors, and hospital admins
- Symptom analysis demo with a simulated AI flow
- Digital risk classification page
- Role-based dashboard pages

## Run locally

### 1. Install dependencies
From the project root:

```bash
npm run install:all
```

### 2. Start everything
```bash
npm run dev
```

This will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:8080

### 3. Open the app
- Login page: http://localhost:8080/login.html
- Home page: http://localhost:8080/index.html

## Notes
- The backend uses MongoDB through the configured environment variables.
- The frontend is a static demo and can also be opened directly in a browser if you do not want to use the live server.
