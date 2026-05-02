# Team Task Manager

A complete, production-ready collaborative project management tool.

## Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, React Query, React Router v6, Zod, dnd-kit
- **Backend**: Node.js, Express.js, TypeScript, PostgreSQL, Prisma, Redis
- **Authentication**: JWT access & refresh tokens (httpOnly cookies)

## Prerequisites
- Node.js (v18+)
- PostgreSQL
- Redis

## Getting Started

### 1. Database Setup
Ensure PostgreSQL and Redis are running locally.
Update the `DATABASE_URL` and `REDIS_URL` in `backend/.env` if necessary.

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npx prisma db push
npm run db:seed
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Architecture Overview
The system uses a classic REST API architecture over Express.js, protected by JWT access tokens. Refresh tokens are stored in Redis/DB and sent via secure `httpOnly` cookies to prevent XSS. Prisma provides robust type safety and interacts with PostgreSQL.

The frontend is a React Single Page Application that uses React Query for intelligent caching and data synchronization. Styling is handled via TailwindCSS. 

### Roles
- **ADMIN**: Can manage projects, invite members, change roles, update/delete tasks.
- **MEMBER**: Can view projects, create tasks, update assigned tasks.

## Default Seeded Users
All users have the password: `Password123!`
- admin@team.com (Admin)
- member1@team.com
- member2@team.com
- member3@team.com
# Team-Task-Manager
# Team-Task-Manager
