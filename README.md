# Y Social

A transient social media platform where posts automatically expire after 24 hours to keep conversations fresh and clutter-free.

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white)

## What the project does

Y Social is a full-stack social networking application featuring time-limited posts, single-level replies, and likes. It implements a JWT-based authentication flow with HTTP-only cookies, and a scheduled background job that removes expired posts (and their associated replies and likes) from the database once a day.

## Why it exists

Traditional social media platforms create permanent records that often lead to digital clutter and privacy concerns. Y Social's posts expire automatically after 24 hours, keeping the feed dynamic and encouraging more spontaneous, lower-stakes sharing.

## Installation

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- A running MongoDB instance (local install, Docker, or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Backend Setup

```bash
cd backend
bun install
```

Create a `.env` file in `backend/` (see [Configuration](#configuration) below), then ensure your MongoDB instance is running and reachable at the URI you configure.

### Frontend Setup

```bash
cd frontend
bun install
```

Create a `.env` file in `frontend/` (see [Configuration](#configuration) below).

## Usage

### Development

1. **Start the backend server:**
   ```bash
   cd backend
   bun run dev
   ```
2. **Start the frontend application:**
   ```bash
   cd frontend
   bun run dev
   ```

### Production

1. **Start the backend** (no build step — Bun runs the TypeScript directly):
   ```bash
   cd backend
   NODE_ENV=production bun run index.ts
   ```
   `NODE_ENV=production` matters here: it's what determines whether auth cookies are marked `secure` (HTTPS-only). Omitting it in a production deploy served over HTTPS will still work, but explicitly setting it is the intended, documented behavior.
2. **Build and serve the frontend:**
   ```bash
   cd frontend
   bun run build
   bun run preview   # or serve the dist/ folder with your static host of choice
   ```

## Configuration

### Backend (`backend/.env`)

| Variable               | Description                                                   | Default                 |
| :--------------------- | :------------------------------------------------------------ | :---------------------- |
| `PORT`                 | Server listener port                                          | `3000`                  |
| `MONGO_URI`            | Connection string for MongoDB                                 | -                       |
| `CORS_ORIGIN`          | Allowed frontend origins (comma-separated)                    | `http://localhost:5173` |
| `ACCESS_TOKEN_SECRET`  | Secret for access JWT                                         | -                       |
| `REFRESH_TOKEN_SECRET` | Secret for refresh JWT                                        | -                       |
| `ACCESS_TOKEN_EXPIRY`  | Duration for access token                                     | `1d`                    |
| `REFRESH_TOKEN_EXPIRY` | Duration for refresh token                                    | `10d`                   |
| `NODE_ENV`             | `development` or `production` — controls cookie `secure` flag | `development`           |

### Frontend (`frontend/.env`)

| Variable       | Description                                                        |
| :------------- | :----------------------------------------------------------------- |
| `VITE_API_URL` | Full URL to the backend API (e.g., `http://localhost:3000/api/v1`) |

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` — Register a new user and log them in
- `POST /api/v1/auth/login` — Log in and set session cookies
- `POST /api/v1/auth/logout` — Clear session cookies
- `GET /api/v1/auth/profile` — Get the current authenticated user's details

### Posts & Interactions

- `GET /api/v1/posts` — Fetch paginated public feed
- `POST /api/v1/posts` — Create a post (expires in 24h) — requires auth
- `GET /api/v1/posts/:postId` — Get a single post
- `PUT /api/v1/posts/:postId` — Update a post's content — requires auth, author only
- `DELETE /api/v1/posts/:postId` — Delete a post — requires auth, author only
- `GET /api/v1/posts/user/:userId` — Fetch all posts by a specific user
- `PATCH /api/v1/posts/:postId/like` — Toggle a like on a post — requires auth
- `POST /api/v1/posts/:postId` — Reply to a post — requires auth
- `GET /api/v1/posts/:postId/replies` — Fetch replies for a post

## Roadmap

- **Connections** — LinkedIn-style mutual connection requests (send/accept/reject), and feed filtering by `visibility: "connections"` for posts limited to your network. The data model exists (`Connections` schema); the API and UI don't yet.
- **Profile pages** — currently a placeholder; needs real user info + their posts.
- **Edit/delete post UI** — backend endpoints exist and work; no frontend UI calls them yet.

## How to contribute

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes: `git commit -m 'Add some amazing feature'`.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request.
