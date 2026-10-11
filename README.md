# Y Social

A social network where **every post disappears after 24 hours**. Share what's on your mind, get replies and likes, and let the feed stay fresh — nothing lingers.

![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat&logo=clerk&logoColor=white)

## Features

- **Ephemeral posts** – each post gets a 24h expiry; a background job deletes expired posts together with their comments and notifications.
- **Comments & replies** – top-level comments with one level of replies, plus comment likes.
- **Likes** – atomic like/unlike with counters.
- **Notifications** – likes, comments and follows.
- **Authentication with [Clerk](https://clerk.com)** – email/social sign-in, session management and the user menu are all handled by Clerk. No passwords or JWTs are stored by this app.
- **Image uploads** – optional, via Cloudinary.

## Tech stack

| Layer    | Tech                                                                 |
| :------- | :------------------------------------------------------------------- |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS 4, React Router 7, Axios    |
| Backend  | Bun, Express 5, Mongoose 9, Zod, node-cron, Multer                   |
| Auth     | Clerk (`@clerk/react` on the client, `@clerk/express` on the server) |
| Data     | MongoDB (local Docker or Atlas), Cloudinary for images               |
| Hosting  | Vercel (frontend), Render (backend), MongoDB Atlas                   |

## How authentication works

```
Browser ── Clerk sign-in ──► Clerk
   │  session token (JWT)
   ▼
Axios adds  Authorization: Bearer <token>
   ▼
Express ── clerkMiddleware() verifies the token on every request
   ▼
protectRoute ── finds (or creates on first sign-in) the MongoDB user by clerkId
   ▼
controllers use req.user
```

- Clerk owns identity (email, name, avatar). MongoDB stores app data (bio, followers, posts…) keyed by `clerkId`.
- The MongoDB user is created automatically the first time a signed-in user calls a protected endpoint – no separate "sync" call.
- The token travels in a header, so there are **no cross-domain cookie issues** between Vercel and Render.
- Reading the feed and posts is public; writing requires sign-in. `/profile` (your own profile) requires sign-in in the UI.

## Getting started

### Prerequisites

- [Bun](https://bun.sh) 1.0+
- A free [Clerk](https://dashboard.clerk.com) application (enable the sign-in methods you want)
- MongoDB – either Docker (`docker compose up -d` in `backend/`) or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend

```bash
cd backend
bun install
cp .env.example .env      # then fill in the values (see below)
docker compose up -d      # optional: local MongoDB on :27017
bun run dev               # http://localhost:3000
```

### 2. Frontend

```bash
cd frontend
bun install
cp .env.example .env      # then fill in the values (see below)
bun run dev               # http://localhost:5173
```

Open http://localhost:5173, click **Sign Up**, and you're in.

## Configuration

### Backend (`backend/.env`)

| Variable                | Required  | Description                                                               | Default                     |
| :---------------------- | :-------- | :------------------------------------------------------------------------ | :-------------------------- |
| `CLERK_PUBLISHABLE_KEY` | yes       | Clerk Dashboard → API keys                                                | –                           |
| `CLERK_SECRET_KEY`      | yes       | Clerk Dashboard → API keys (**keep secret**)                              | –                           |
| `MONGO_URI`             | prod only | MongoDB connection string, without a database name (`ysocial` is used)    | `mongodb://localhost:27017` |
| `CORS_ORIGIN`           | no        | Allowed frontend origin(s), comma-separated, **exact, no trailing slash** | `http://localhost:5173`     |
| `PORT`                  | no        | Server port                                                               | `3000`                      |
| `NODE_ENV`              | no        | `development` or `production`                                             | `development`               |
| `CLOUDINARY_*`          | no        | `CLOUD_NAME`, `API_KEY`, `API_SECRET` – only for image uploads            | –                           |

The server refuses to start if the Clerk keys are missing.

### Frontend (`frontend/.env`)

| Variable                     | Description                                                                |
| :--------------------------- | :------------------------------------------------------------------------- |
| `VITE_API_URL`               | Backend base URL including the prefix, e.g. `http://localhost:3000/api/v1` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (public by design)                                   |

## API

Base path: `/api/v1`. 🔒 = requires a signed-in user (`Authorization: Bearer <Clerk session token>`).

| Method & path                         | Description                                            |
| :------------------------------------ | :----------------------------------------------------- |
| `GET /healthcheck`                    | Liveness check                                         |
| **Posts**                             |                                                        |
| `GET /posts?page=&limit=`             | Paginated feed of unexpired posts                      |
| `GET /posts/:postId`                  | Single post                                            |
| `GET /posts/user/:username`           | Posts by a user                                        |
| `POST /posts` 🔒                      | Create a post (`content` and/or `image`, multipart)    |
| `PUT /posts/:postId` 🔒               | Edit your post                                         |
| `DELETE /posts/:postId` 🔒            | Delete your post                                       |
| `PATCH /posts/:postId/like` 🔒        | Toggle like                                            |
| **Comments**                          |                                                        |
| `GET /comments/post/:postId`          | Top-level comments of a post                           |
| `POST /comments/post/:postId` 🔒      | Comment (`content`, optional `parentComment` to reply) |
| `GET /comments/:commentId/replies`    | Replies to a comment                                   |
| `POST /comments/:commentId/like` 🔒   | Toggle like                                            |
| `DELETE /comments/:commentId` 🔒      | Delete (comment author or post owner)                  |
| **Users**                             |                                                        |
| `GET /users/profile/:username`        | Public profile                                         |
| `GET /users/me` 🔒                    | Current user                                           |
| `PUT /users/me` 🔒                    | Update `bio`, `website`, `isPrivate`                   |
| `POST /users/:targetUserId/follow` 🔒 | Follow / unfollow                                      |
| **Notifications**                     |                                                        |
| `GET /notifications` 🔒               | Your notifications                                     |
| `DELETE /notifications/:id` 🔒        | Dismiss one                                            |

Responses use the envelope `{ statusCode, data, message, success }`; errors return `{ success: false, message }`.

## Project structure

```
ysocial/
├── backend/
│   ├── index.ts                 # entry: connect DB, start cleanup job, listen
│   ├── docker-compose.yml       # local MongoDB
│   └── src/
│       ├── app.ts               # CORS, Clerk middleware, routes, error handling
│       ├── config/              # env validation, db, cloudinary
│       ├── controllers/         # request handlers
│       ├── routes/              # route definitions
│       ├── middlewares/         # protectRoute (Clerk), upload, errors
│       ├── services/            # user.service – Clerk user → MongoDB user
│       ├── models/              # Mongoose models
│       ├── schema/              # Zod schemas
│       ├── jobs/                # 24h post cleanup (every 5 min)
│       └── utils/
└── frontend/
    ├── vercel.json              # SPA rewrite
    └── src/
        ├── main.tsx             # Router + ClerkProvider
        ├── App.tsx              # routes
        ├── api/                 # typed API calls
        ├── lib/api-client.ts    # Axios + Clerk token interceptor
        ├── components/          # Navbar, Layout, ProtectedRoute, …
        └── pages/               # HomeFeed, PostPage, ProfilePage, sign-in/up
```

## Deployment

1. **MongoDB Atlas** – create a cluster; under _Network Access_ allow `0.0.0.0/0` (Render's free tier has no fixed IPs).
2. **Clerk** – for production, create a production instance and add your Vercel domain.
3. **Backend on Render** – root dir `backend`, start command `bun run start`. Set `NODE_ENV=production`, `MONGO_URI`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` and `CORS_ORIGIN` (your exact Vercel URL).
4. **Frontend on Vercel** – root dir `frontend`, set `VITE_API_URL` (`https://<render-app>/api/v1`) and `VITE_CLERK_PUBLISHABLE_KEY`. `vercel.json` handles client-side routing.

## Scripts

| Where      | Command             | What it does          |
| :--------- | :------------------ | :-------------------- |
| `backend`  | `bun run dev`       | Start with watch mode |
| `backend`  | `bun run start`     | Start (production)    |
| `backend`  | `bun run typecheck` | TypeScript check      |
| `frontend` | `bun run dev`       | Vite dev server       |
| `frontend` | `bun run build`     | Type-check and build  |
| `frontend` | `bun run lint`      | ESLint                |

## Roadmap

- Clerk webhooks (`user.updated` / `user.deleted`) to keep MongoDB profiles in sync and clean up deleted accounts
- Profile page with the user's posts and follow button
- Image upload in the composer, and edit/delete post UI (the API already supports them)
- "Liked by me" state from the server (currently tracked client-side)
- Delete Cloudinary images when a post expires
- Connections (mutual requests) and `connections`-only visibility

## Contributing

1. Fork the repo and create a branch: `git checkout -b feature/my-feature`
2. Commit your changes and push the branch
3. Open a Pull Request
