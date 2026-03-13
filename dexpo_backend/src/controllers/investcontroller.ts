import { Request, Response } from "express";
import prisma from "../config/db";
import { parse } from "node:path";

export const createInvestment = async (req: Request, res: Response) => {
    const { stall_id, amount_invested } = req.body;
    const u_id = req.user?.u_id; //from jwt middleware
    const BUDGET_LIMIT = 20000; // ₹20,000 max budget

    console.log('createInvestment - req.user:', req.user);
    console.log('createInvestment - u_id:', u_id);

    if (!u_id) {
        console.log('Unauthorized: No user ID in request');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const amount = parseFloat(amount_invested);

        // Validate amount
        if (amount < 100) {
            return res.status(400).json({ message: 'Investment must be at least ₹100' });
        }

        // Get user's current total investments
        const userData = await prisma.users.findUnique({
            where: { u_id },
            include: {
                investments: true,
            },
        });

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate total invested so far
        const totalInvested = userData.investments.reduce(
            (sum, inv) => sum + parseFloat(inv.amount_invested.toString()),
            0
        );

        // Check if new investment would exceed budget
        if (totalInvested + amount > BUDGET_LIMIT) {
            return res.status(400).json({
                message: `Investment exceeds budget limit. You have ₹${BUDGET_LIMIT - totalInvested} remaining.`,
                remaining: BUDGET_LIMIT - totalInvested,
            });
        }

        const investment = await prisma.investments.create({
            data: {
                user_id: u_id,
                stall_id,
                amount_invested: amount,
            },
        });
        res.status(201).json(investment);
    } catch (error) {
        console.error('Error creating investment:', error);
        res.status(500).json({ message: 'Error creating investment', error: error instanceof Error ? error.message : 'Unknown error' });
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
    const u_id = req.user?.u_id;

    if (!u_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify the investment belongs to the user
        const investment = await prisma.investments.findUnique({
            where: { investment_id }
        });

        if (!investment || investment.user_id !== u_id) {
            return res.status(403).json({ message: 'Forbidden: Cannot delete this investment' });
        }

        await prisma.investments.delete({
            where: { investment_id }
        });
        res.status(200).json({ message: 'Investment deleted successfully' });
    } catch (error) {
        console.error('Error deleting investment:', error);
        res.status(500).json({ message: 'Error deleting investment', error: error instanceof Error ? error.message : 'Unknown error' });
    }
}
