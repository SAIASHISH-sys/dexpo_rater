# Delta Expo 2026 - Rating & Investment Platform

A full-stack application for Delta Expo 2026 where attendees can scan stall QR codes, invest virtual currency, and rate startups. Stalls can manage their profiles and track their leaderboard position.

## Project Structure

```
dexpo/
├── dexpo_backend/    # Express + TypeScript backend
└── dexpo_frontend/   # React + TypeScript + Vite frontend
```

## Features

### For Attendees (Users)
- Login with email/password (auto-creates account)
- Scan QR codes to discover stalls
- View stall information
- Invest virtual currency (₹20,000 budget)
- Manage investment portfolio
- Track spending and remaining budget

### For Stalls (Companies)
- Login with email/password or Google OAuth
- Manage company profile (name, organisation, description)
- View leaderboard position
- Track investments received

## Tech Stack

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Passport.js
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: Custom glass-morphism design

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database (or Neon serverless database)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd dexpo_backend
```

2. Install dependencies:
```bash
npm install
```

3. Install CORS package:
```bash
npm install cors
npm install --save-dev @types/cors
```

4. Configure environment variables:
Create a `.env` file in `dexpo_backend/` directory:
```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_secret_key"
```

5. Generate Prisma client:
```bash
npm run prisma:generate
```

6. Run database migrations:
```bash
npm run prisma:migrate
```

7. Start development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd dexpo_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
The `.env` file is already created with:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/users/login` - User login (auto-creates if not exists)
- `POST /api/auth/stalls/login` - Stall login (auto-creates if not exists)
- `GET /api/auth/google` - Google OAuth (stalls only)
- `GET /api/auth/google/callback` - Google OAuth callback

### Stalls
- `GET /api/stalls/stalls` - Get all stalls
- `GET /api/stalls/stalls/:id` - Get stall by ID
- `POST /api/stalls/stalls/update-data` - Update stall data (authenticated)

### Investments
- `POST /api/investments/users/invest` - Create investment (authenticated)
- `GET /api/investments/users/myportfolio` - Get user investments (authenticated)
- `DELETE /api/investments/users/:investment_id` - Delete investment (authenticated)

## Usage

### For Attendees
1. Go to `http://localhost:5173`
2. Select "Attendee" role
3. Enter email and password (account created automatically if new)
4. Use QR scanner (currently simulated) to scan stall codes
5. View stall information and invest virtual currency
6. Manage investments in the portfolio accordion

### For Stalls
1. Go to `http://localhost:5173`
2. Select "Stall / Company" role
3. Enter email and password (or use Google login)
4. Edit profile information (name, organisation, description)
5. View leaderboard to see ranking (coming soon)

## Troubleshooting

### Backend won't start
- Check PostgreSQL connection string in `.env`
- Ensure Prisma migrations are run: `npm run prisma:migrate`
- Check if port 5000 is available

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS settings in `backend/src/app.ts`
- Ensure `.env` has correct `VITE_API_BASE_URL`

### TypeScript errors in backend
- Run `npm run dev` to watch for type errors
- Ensure express-session is installed: `npm install express-session`

## License

MIT