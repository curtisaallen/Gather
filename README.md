# Gather — Community Event Discovery Platform

A full-stack web application that helps users discover local events, create and manage events, and connect with their communities.

**Live Demo:** https://gather-production-d9b4.up.railway.app

## Features

- User registration and login with JWT authentication
- Browse and search events by name and location
- Create, edit, and delete events
- Manage personally created events through a dashboard
- Join events and cancel attendance
- Persistent event and attendance data
- Responsive design for desktop and mobile
- RESTful API with interactive Swagger documentation

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

**Backend**
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- JWT authentication

**Deployment**
- Railway
- GitHub

## Application Architecture

The frontend is a React single-page application that communicates with a FastAPI REST API.

FastAPI handles authentication, event management, attendance, and database operations.

PostgreSQL stores application data, while SQLAlchemy and Alembic provide database access and schema migrations.

Both frontend and backend are deployed on Railway.

## Running Locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Configure the required environment variables and PostgreSQL connection using your local environment configuration.

Run migrations:

```bash
alembic upgrade head
```

Start the API:

```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## API Features

- User registration and authentication
- Current user profile
- Event listing and details
- Event creation, editing, and deletion
- Event search
- Event attendance management

## Future Improvements

- Event dates and scheduling
- Event categories and advanced filtering
- User profile management
- Image uploads
- Email notifications

## Project Purpose

Gather was developed as a full-stack portfolio project demonstrating modern frontend development, REST API design, authentication, relational database integration, and cloud deployment.
