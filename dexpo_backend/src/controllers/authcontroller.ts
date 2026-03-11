import  { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const userSignup = async (req: Request, res: Response) => {
    const { email_id, password } = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: { email_id, password: hashedPassword }
        })
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
};

export const userLogin = async (req: Request, res: Response) => {
    const { email_id, password } = req.body;
    const user = await prisma.users.findUnique({ where: { email_id } });
    if (user && ( await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ u_id: user.u_id, email: user.email_id}, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token , u_id : user.u_id });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
}