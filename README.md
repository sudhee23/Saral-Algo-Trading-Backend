# Algo Trading Backend

A professional backend API for the Algo Trading application built with Hono and Cloudflare Workers.

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── routes/           # API route handlers
│   │   ├── auth.ts       # Authentication routes
│   │   ├── quote.ts      # Stock quote routes (with mock data)
│   │   └── index.ts      # Route exports
│   ├── middlewares/      # Middleware functions
│   │   ├── auth.ts       # JWT authentication
│   │   └── hash.ts       # Password hashing
│   ├── database/         # Database operations
│   │   ├── users.ts      # User database operations
│   │   └── index.ts      # Database exports
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts      # Common interfaces
│   ├── utils/            # Utility functions
│   │   ├── database.ts   # Database utilities
│   │   └── init-db.ts    # Database initialization
│   └── index.ts          # Main application entry point
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── wrangler.toml         # Cloudflare Workers configuration
├── schema.sql           # Database schema
├── init-db.js           # Database initialization script
└── test-api.http        # API test file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Cloudflare account with D1 database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables in `wrangler.toml`

3. Initialize the database (run this once):
```bash
npx wrangler d1 execute algo_trading_db --local --file=schema.sql
```

4. Run the development server:
```bash
npm run dev
```

The server will start at `http://127.0.0.1:8787`

## 📡 API Endpoints

### Health Check
- `GET /` - API health check and status

### Authentication Routes (`/auth`)

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - User logout

### Quote Routes (`/quote`)

- `GET /quote/ticker/:symbol` - Get stock quote (currently returns mock data)
- `GET /quote/history/:symbol` - Get historical data (currently returns mock data)

### Database Management

- `POST /init-db` - Initialize database tables (development only)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run start` - Start production server
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run init-db` - Initialize database (alternative method)

### Environment Variables

Configure these in `wrangler.toml`:

- `JWT_SECRET` - Secret key for JWT tokens
- `DB` - D1 database binding

### Database Setup

To set up the database for the first time:

```bash
# Method 1: Using wrangler directly
npx wrangler d1 execute algo_trading_db --local --file=schema.sql

# Method 2: Using the API endpoint (when server is running)
curl -X POST http://127.0.0.1:8787/init-db

# Method 3: Using the npm script
npm run init-db
```

### Testing the API

Use the `test-api.http` file to test the endpoints with tools like VS Code REST Client or Postman.

## 🛠️ Technologies Used

- **Hono** - Fast web framework
- **Cloudflare Workers** - Serverless platform
- **D1 Database** - SQLite database
- **TypeScript** - Type safety
- **bcryptjs** - Password hashing

## 📝 Database Schema

The database includes two main tables:

### Users Table
- `id` - Primary key (INTEGER AUTOINCREMENT)
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (ADMIN or USER)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Portfolios Table
- `id` - Primary key (INTEGER AUTOINCREMENT)
- `user_id` - Foreign key to users table
- `symbol` - Stock symbol
- `quantity` - Number of shares
- `average_price` - Average purchase price
- `created_at` - Record creation timestamp

## 🔄 Current Status

✅ **Working Features:**
- Authentication system (login, signup, logout)
- JWT token management
- Password hashing
- Database operations
- CORS support
- Error handling
- TypeScript compilation
- Local development server
- Database initialization
- All API endpoints tested and working

⚠️ **Mock Data:**
- Stock quote endpoints currently return mock data
- Real stock data integration needs to be implemented

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production Deployment
```bash
npm run deploy
```

**Note:** Cloudflare Workers handles TypeScript compilation automatically during deployment, so no separate build step is required.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License 