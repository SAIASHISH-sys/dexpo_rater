import  { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// export const userSignup = async (req: Request, res: Response) => {
//     const { email_id, password } = req.body;

//     try{
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await prisma.users.create({
//             data: { email_id, password: hashedPassword }
//         })
//         res.status(201).json({ message: 'User created successfully', user });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating user' });
//     }
// };

export const userLogin = async (req: Request, res: Response) => {
    const { email_id, password } = req.body;
    const user = await prisma.users.findUnique({ where: { email_id } });
    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.users.create({
            data: {email_id, password: hashedPassword}
        })
        const token = jwt.sign({ u_id: newUser.u_id, email: newUser.email_id}, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({message : 'user created successfully', token, u_id: newUser.u_id });}

    else if (user && ( await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ u_id: user.u_id, email: user.email_id}, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token , u_id : user.u_id });
    } else {
        res.status(500).json({ message: 'Error During Login' });
    }
}


export const stallLogin = async (req: Request, res: Response) => {
    const { email_id, password } = req.body;
    const stall = await prisma.stalls.findUnique({ where: { email_id } });
    if (!stall) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.users.create({
            data: {email_id, password: hashedPassword}
        })
        res.status(201).json({message : 'user created successfully', user });}

    else if (stall && stall.password && ( await bcrypt.compare(password, stall.password))) {
        const token = jwt.sign({ u_id: stall.stall_id, email: stall.email_id}, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token , u_id : stall.stall_id });
    } else {
        res.status(500).json({ message: 'Error During Login' });
    }
}
