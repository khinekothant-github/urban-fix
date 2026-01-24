# Urban Fix

[![Project Status](https://img.shields.io/badge/status-active-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)]()

Urban Fix is a project scaffold intended to help manage and coordinate urban maintenance, reporting, and repair workflows. This platform connects citizens, municipal workers, and contractors through a workflow-driven system for reporting and resolving urban issues.

## Project Overview

Urban Fix is designed to simplify the reporting, tracking, and remediation of urban issues (e.g., potholes, broken lights, graffiti, waste pickup). It aims to connect citizens, municipal workers, and contractors through a workflow-driven platform.
<img width="1363" height="679" alt="image" src="https://github.com/user-attachments/assets/87891283-24f7-4513-8b49-ea55e6fd01da" />


Core goals:
- Easy citizen reporting via web interface with photo uploads and geolocation.
- Structured issue triage and assignment for city staff.
- Status tracking and analytics for administrators.
- Secure, audit-friendly operations with role-based access.

## Key Features

- Issue reporting (photos, description, location)
- Geolocation + map integration using MapLibre GL
- Issue categorization (road, garbage, flood, light) and severity levels (pending, verified, in_progress, fixed)
- Assignment & escalation workflows
- Admin dashboard with filters, reports, and analytics
- API for integrations
- Role-based access control (citizen, admin)
- Issue update tracking

## Architecture & Tech Stack

- Frontend: Next.js (React, TypeScript), Tailwind CSS, MapLibre GL
- Backend: Laravel (PHP 8.2+), SQL database
- Authentication: Laravel Sanctum (implied from auth controller)
- Storage: Local file storage 

Diagram (conceptual):

Citizen --> Frontend (web) --> Backend API --> Database
                                             \
                                              --> Storage (images)

## Getting Started

Follow these steps to run Urban Fix locally.

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js (>=18) and npm
- SQLite (default database)

### Installation

1. Clone the repo
```bash
git clone https://github.com/khinekothant-github/urban-fix.git
cd urban-fix
```

2. Install backend dependencies
```bash
cd backend
composer install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the backend directory based on `.env.example`:

```
APP_NAME=Urban Fix
APP_ENV=local
APP_KEY=  # Generate with php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database/database.sqlite

# For AWS S3 if needed
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
```

### Running Locally

Use the provided dev script to run both backend and frontend concurrently:

```bash
cd backend
composer run dev
```

This will start:
- Laravel server on http://localhost:8000
- Queue worker
- Logs
- Vite dev server for frontend on http://localhost:3000

Open http://localhost:3000 for the frontend.


## Usage

### Web UI

- Report an issue: Navigate to the main page, click "Report Issue", fill form, attach photos, submit
- Track issues: Use filters (status, category, location) on the map and issue list
- Admin: Access /admin page to view dashboard, assign issues, update statuses

### API (Example)

Base URL: `http://localhost:8000/api`

Authentication: Bearer token (Laravel Sanctum)

Create issue:
```http
POST /api/issues
Headers:
  Authorization: Bearer <token>
  Content-Type: multipart/form-data

Body:
  title: "Pothole on Elm St"
  description: "Large pothole near 3rd Ave"
  category: "road"
  latitude: 12.34
  longitude: 56.78
  address: "Elm St, City"
  photo: [file]
```

Get issues:
```http
GET /api/issues?status=pending&category=road
```

Update issue status:
```http
POST /api/issues/{id}/update
Body:
  status: "in_progress"
```

## Database & Migrations

Using Laravel migrations with SQLite.

Run migrations:
```bash
cd backend
php artisan migrate
```


## Configuration

- Database: Configurable to MySQL/PostgreSQL
- Storage: Local, or AWS S3 by setting FILESYSTEM_DISK=s3
- Maps: MapLibre GL, no API key required


## Acknowledgements

- Laravel framework
- Next.js
- MapLibre GL
- Tailwind CSS
- Radix UI
