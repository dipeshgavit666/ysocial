# Y Social

A full-stack social media platform featuring transient posts, connection management, and real-time interactions.

## What the project does

Y Social is a high-performance social networking application that allows users to create posts with expiration dates, reply to threads, and manage social connections. It includes a background cleanup service to automatically remove expired content, a robust JWT-based authentication system, and a modern React frontend.

## Why it exists

This project addresses "digital clutter" by implementing a TTL (Time-To-Live) mechanism for social posts. By ensuring content automatically expires, the platform maintains a fresh, relevant feed while optimizing database storage through scheduled background cleanup tasks.

## Installation

### Prerequisites

- [Bun](https://bun.sh) runtime
- [Docker](https://www.docker.com/) (optional, for MongoDB)
- [MongoDB](https://www.mongodb.com/) instance

### Backend Setup

```bash
cd backend
bun install
# Start MongoDB via Docker if needed
docker-compose up -d
```

### Frontend Setup

```bash
cd frontend
bun install
```

## Usage

### Development

1.  **Start the backend:**
    ```bash
    cd backend
    bun run dev
    ```
2.  **Start the frontend:**
    ```bash
    cd frontend
    bun run dev
    ```

### Production Build

```bash
# Backend
cd backend
bun run start

# Frontend
cd frontend
bun run build
```

## Configuration

Create a `.env` file in the `backend/` directory:

| Variable               | Description               | Example                     |
| ---------------------- | ------------------------- | --------------------------- |
| `PORT`                 | Server port               | `3000`                      |
| `MONGO_URI`            | MongoDB connection string | `mongodb://localhost:27017` |
| `CORS_ORIGIN`          | Allowed CORS origins      | `http://localhost:5173`     |
| `ACCESS_TOKEN_SECRET`  | Secret for Access JWT     | `your_secret`               |
| `REFRESH_TOKEN_SECRET` | Secret for Refresh JWT    | `your_secret`               |
| `ACCESS_TOKEN_EXPIRY`  | Access token duration     | `1d`                        |
| `REFRESH_TOKEN_EXPIRY` | Refresh token duration    | `10d`                       |

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Create a new account
- `POST /api/v1/auth/login` - Authenticate user and receive cookies
- `POST /api/v1/auth/logout` - Clear session cookies
- `GET /api/v1/auth/profile` - Get current authenticated user

### Posts
- `GET /api/v1/posts` - Fetch paginated public feed
- `POST /api/v1/posts` - Create a new post (expires in 24h)
- `GET /api/v1/posts/:postId` - Get specific post details
- `PUT /api/v1/posts/:postId` - Update post content
- `DELETE /api/v1/posts/:postId` - Remove a post
- `PATCH /api/v1/posts/:postId/like` - Toggle like status
- `POST /api/v1/posts/:postId` - Create a reply to a post
- `GET /api/v1/posts/:postId/replies` - Fetch all replies for a post

## How to contribute

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License

Private / All Rights Reserved.