import 'dotenv/config';
import express from "express";
import passport from "passport";
import session from 'express-session';
import cors from 'cors';
import './config/passport';
import authRoutes from './routes/authRoute';
import stallRoutes from './routes/stallRoutes';
import investRoutes from './routes/investRoutes';

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true,
}));

app.use(express.json());

app.use(session({secret: 'gaac_secret', resave: false, saveUninitialized: true}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/stalls', stallRoutes);
app.use('/api/investments', investRoutes);

app.listen(5000, ()=> console.log('server running on port 5000'));