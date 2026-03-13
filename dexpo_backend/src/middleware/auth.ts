import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface User {
            u_id: string;
            email: string;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const isAuthenticatedStall = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const authenticateUserJWT = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        console.log('No authorization header provided');
        return res.status(401).json({ message: 'No token provided' });
    }
    if(!authHeader.startsWith('Bearer ')) {
        console.log('Invalid authorization header format:', authHeader);
        return res.status(401).json({ message: 'Invalid token format' });
    }
    const token = authHeader.split(' ')[1];
    if(!token) {
        console.log('No token found after Bearer');
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log('JWT verification failed:', err instanceof Error ? err.message : err);
        res.status(401).json({ message: 'Invalid token', error: err instanceof Error ? err.message : 'Unknown error' });
    }
};