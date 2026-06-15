# Y Social

A full-stack social media platform featuring transient posts, connection management, and real-time interactions.

## What the project does
Y Social is a high-performance social networking application that allows users to create posts with expiration dates, reply to threads, and manage social connections. It includes a background cleanup service to automatically remove expired content, a robust JWT-based authentication system, and a modern React frontend.

## Why it exists
This project serves as a reference implementation for a modern TypeScript stack using Express 5 and React 19. It solves the problem of "digital clutter" by implementing a TTL (Time-To-Live) mechanism for social posts, ensuring a fresh and relevant feed while optimizing database storage through automated cleanup jobs.

## Installation

### Prerequisites
- [Bun](https://bun.sh) runtime
- [MongoDB](https://www.mongodb.com/) instance

### Backend Setup
```bash
cd backend
bun install
```

### Frontend Setup
```bash
cd frontend
bun install
```

## Usage

### Development
1. **Start the backend:**
   ```bash
   cd backend
   bun run dev
   ```
2. **Start the frontend:**
   ```bash
   cd frontend
   bun run dev
   ```

### Production Build
```bash
# Backend
cd backend
bun run index.ts

# Frontend
cd frontend
bun run build
```

## Configuration
Create a `.env` file in the `backend/` directory:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:5173` |
| `ACCESS_TOKEN_SECRET` | Secret for Access JWT | `your_secret` |
| `REFRESH_TOKEN_SECRET` | Secret for Refresh JWT | `your_secret` |
| `ACCESS_TOKEN_EXPIRY` | Access token duration | `1d` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token duration | `10d` |

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Create a new account
- `POST /api/v1/auth/login` - Authenticate user
- `POST /api/v1/auth/logout` - Clear session

### Posts
- `GET /api/v1/posts` - Fetch paginated feed
- `POST /api/v1/posts` - Create post (auth required)
- `GET /api/v1/posts/:postId` - Get specific post and replies
- `PATCH /api/v1/posts/:postId/like` - Toggle like status

## How to contribute
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License
Private / All Rights Reserved.