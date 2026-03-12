import { Request, Response } from "express";
import prisma from "../config/db";
import { parse } from "node:path";

export const createInvestment = async (req: Request, res: Response) => {
    const { stall_id, amount_invested } = req.body;
    const u_id = req.user?.u_id; //from jwt middleware

    if (!u_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const investment = await prisma.investments.create({
            data: {
                user_id: u_id,
                stall_id,
                amount_invested: parseFloat(amount_invested),
            },
        });
        res.status(201).json(investment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating investment' });
    }
};

export const getUserInvestments = async (req: Request, res: Response) => {
    const u_id = req.user?.u_id; //from jwt middleware
    
    if (!u_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const data = await prisma.users.findUnique({
            where: {u_id: u_id},
            include: {
                investments: {
                    include: {
                        stalls: true,
                    },
                }
            }
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user investments' });
    }
};

export const deleteInvestment = async (req: Request, res: Response) => {
    const investment_id = req.params.investment_id as string;
    await prisma.investments.delete({
        where: { investment_id: investment_id } },
    );
    res.status(200).json({ message: 'Investment deleted successfully' });
}
