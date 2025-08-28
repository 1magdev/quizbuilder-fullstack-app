# Quiz Builder

A full-stack quiz creation and management application built with Next.js and NestJS.

## Features

- Create quizzes with multiple question types
- Support for short text, true/false, and multiple choice questions
- View and manage existing quizzes
- Delete quizzes with confirmation
- Responsive design with modern UI

## Tech Stack

### Frontend
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- FontAwesome icons
- Axios for API calls

### Backend
- NestJS with TypeScript
- Prisma ORM
- PostgreSQL database
- Swagger API documentation

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Yarn or npm

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables
4. Run database migrations
5. Start the development servers

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3001

### Backend Setup
```bash
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

The backend will run on http://localhost:3000

## API Documentation

Once the backend is running, visit http://localhost:3000/docs for Swagger API documentation.

## Project Structure

### Frontend
- `/src/app` - Next.js app router pages
- `/src/components` - Reusable UI components
- `/src/lib` - API client and utilities

### Backend
- `/src/quiz` - Quiz module with controllers, services, and DTOs
- `/src/shared` - Shared modules like Prisma
- `/prisma` - Database schema and migrations

## Question Types

1. **Short Text** - Open-ended text responses with optional placeholder
2. **Boolean** - True/false questions with correct answer selection
3. **Multiple Choice** - Questions with multiple options and single correct answer
