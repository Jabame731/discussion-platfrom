# Wellness Hub

A community platform for sharing, discovering, and discussing evidence-based wellness protocols. Users can publish protocols, leave star ratings and written reviews, and open threaded discussions — all backed by full-text search powered by Typesense.

 **Live app:** [https://discussion-platfrom-4pvq.vercel.app](https://discussion-platfrom-4pvq.vercel.app)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-PHP-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E?style=flat-square&logo=railway&logoColor=white)

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Backend Setup (Laravel)](#backend-setup-laravel)
- [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
- [Typesense Setup](#typesense-setup)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Authentication](#authentication)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, Redux Toolkit, Redux Persist |
| Backend | Laravel (PHP), Laravel Sanctum, Laravel Scout |
| Search | Typesense |
| HTTP client | Axios |
| Routing | React Router v7 |

---

## Project Structure

```
/
├── backend/          # Laravel API
└── frontend/         # React + Vite SPA
```

---

## Backend Setup (Laravel)

### Prerequisites

- PHP >= 8.2
- Composer
- MySQL (or any Laravel-supported DB)
- A running Typesense instance (see [Typesense Setup](#typesense-setup))

### Steps

```bash
# 1. Install PHP dependencies
cd backend
composer install

# 2. Copy the environment file
cp .env.example .env

# 3. Generate the application key
php artisan key:generate

# 4. Configure your database credentials in .env
#    DB_DATABASE, DB_USERNAME, DB_PASSWORD

# 5. Run migrations and seed the database
php artisan migrate --seed

# 6. Index existing records into Typesense
php artisan scout:import "App\Models\Protocol"
php artisan scout:import "App\Models\Thread"

# 7. Start the development server
php artisan serve
# API is now available at http://localhost:8000
```

---

## Frontend Setup (React + Vite)

### Prerequisites

- Node.js >= 20
- npm

### Steps

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Copy the environment file
cp .env.example .env

# 3. Fill in your values (see Environment Variables section)
#    At minimum you need VITE_API_URL and VITE_TYPESENSE_SEARCH_KEY

# 4. Start the dev server
npm run dev
# App runs at http://localhost:5173

# Build for production
npm run build
```

---

## Typesense Setup

Typesense is used for fast, typo-tolerant full-text search across protocols and threads. The frontend queries Typesense directly with a **search-only** API key; the backend uses the **admin** key to write (index) documents via Laravel Scout.

### Create a search-only API key

After the container is running, create a restricted key that the frontend can safely expose:

```bash
curl -X POST http://localhost:8108/keys \
  -H "X-TYPESENSE-API-KEY: your_typesense_admin_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Search-only key for frontend",
    "actions": ["documents:search"],
    "collections": ["protocols", "threads"]
  }'
```

Copy the returned `value` and set it as `VITE_TYPESENSE_SEARCH_KEY` in `frontend/.env`.

### Collections

The backend automatically creates and maintains two Typesense collections via Laravel Scout:

**`protocols`** — indexed fields: `title`, `content`, `tags`, `author_name`, `status`, `average_rating`, `reviews_count`, `upvotes_count`, `downvotes_count`, `created_at`

**`threads`** — indexed fields: `title`, `body`, `tags`, `author_name`, `protocol_id`, `protocol_title`, `status`, `upvotes_count`, `downvotes_count`, `comments_count`, `created_at`

### Re-index all records

```bash
php artisan scout:import "App\Models\Protocol"
php artisan scout:import "App\Models\Thread"
```

---

## Environment Variables

Copy `.env.example` to the appropriate locations and fill in your values.

### Backend — `backend/.env`

| Variable | Description |
|---|---|
| `APP_KEY` | Laravel app key — generate with `php artisan key:generate` |
| `DB_*` | Database connection details |
| `TYPESENSE_API_KEY` | Admin API key for Typesense (used by Scout to write data) |
| `TYPESENSE_HOST` | Typesense host (default: `localhost`) |
| `TYPESENSE_PORT` | Typesense port (default: `8108`) |
| `TYPESENSE_PROTOCOL` | `http` or `https` |
| `SCOUT_DRIVER` | Set to `typesense` |
| `SANCTUM_STATEFUL_DOMAINS` | Frontend origin, e.g. `localhost:5173` |

### Frontend — `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Full URL to the Laravel API, e.g. `http://localhost:8000/api` |
| `VITE_TYPESENSE_HOST` | Typesense host |
| `VITE_TYPESENSE_PORT` | Typesense port |
| `VITE_TYPESENSE_PROTOCOL` | `http` or `https` |
| `VITE_TYPESENSE_SEARCH_KEY` | **Search-only** Typesense API key — safe to expose in the browser |

> **Security note:** Never put your Typesense admin key in any `VITE_*` variable. Admin keys are server-side only.

---

## API Overview

All endpoints are prefixed with `/api`. Authentication uses Laravel Sanctum bearer tokens — pass the token as `Authorization: Bearer <token>` on protected routes.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login and receive a token |
| `POST` | `/auth/logout` | Required | Invalidate the current token |
| `GET` | `/auth/me` | Required | Get the authenticated user |

### Protocols

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/protocols` | Public | List protocols (paginated). Supports `sort`, `page`, `per_page`, `q`, `tags[]` query params |
| `GET` | `/protocols/:slug` | Public | Get a single protocol by slug |
| `POST` | `/protocols` | Required | Create a new protocol |
| `PUT` | `/protocols/:id` | Required (owner) | Update a protocol |
| `DELETE` | `/protocols/:id` | Required (owner) | Delete a protocol |

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/protocols/:id/reviews` | Public | List reviews for a protocol |
| `POST` | `/protocols/:id/reviews` | Required | Submit a review (rating + feedback) |
| `PUT` | `/reviews/:id` | Required (owner) | Update own review |
| `DELETE` | `/reviews/:id` | Required (owner) | Delete own review |

### Threads

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/threads` | Public | List all threads (paginated). Supports `sort`, `page`, `per_page` |
| `GET` | `/threads/:id` | Public | Get a single thread with its comments |
| `POST` | `/threads` | Required | Create a thread (optionally linked to a protocol via `protocol_id`) |
| `PUT` | `/threads/:id` | Required (owner) | Update a thread |
| `DELETE` | `/threads/:id` | Required (owner) | Delete a thread |
| `POST` | `/threads/:id/vote` | Required | Upvote or downvote a thread. Body: `{ "type": "upvote" \| "downvote" }` |
| `GET` | `/protocols/:id/threads` | Public | List threads linked to a specific protocol |

### Comments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/threads/:id/comments` | Public | Get nested comments for a thread |
| `POST` | `/threads/:id/comments` | Required | Post a comment. Body: `{ "body": "...", "parent_id": null \| number }` |
| `PUT` | `/comments/:id` | Required (owner) | Edit a comment |
| `DELETE` | `/comments/:id` | Required (owner) | Soft-delete a comment (body replaced with `[deleted]`) |
| `POST` | `/comments/:id/vote` | Required | Vote on a comment. Body: `{ "type": "upvote" \| "downvote" }` |

### Sorting options

**Protocols** — pass as `?sort=`:
`recent` · `top_rated` · `most_reviewed` · `most_upvoted`

**Threads** — pass as `?sort=`:
`recent` · `most_upvoted` · `most_comments`

---

## Authentication

The app uses **Laravel Sanctum** with token-based auth. On login or register the API returns a `token` string. The frontend stores this token in `localStorage` (key: `auth_token`) and attaches it to every subsequent request via the `Authorization: Bearer <token>` header, handled automatically by the Axios interceptor in `frontend/src/app/data/models/api.ts`.

**Demo credentials** (available after seeding):
```
Email:    demo@wellness.test
Password: password
```
