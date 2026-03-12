import { Request, Response } from "express";
import prisma from "../config/db";

export const getStallById = async (req: Request, res: Response) => {
    const stall_id = req.params.stall_id as string;
    try {
        const stall = await prisma.stalls.findUnique({
            where: { stall_id: stall_id } },
        );
        if (!stall) {
            return res.status(404).json({ message: 'Stall not found' });
        }
        res.status(200).json(stall);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stall' });
    }
};

export const updateStallData = async (req: any, res: Response) => {
    const stall_id = req.user.stall_id;
    const { name, organisations, about } = req.body;
    
    try {   
        const updatedStall = await prisma.stalls.update({
            where: { stall_id: stall_id },
            data: { name, organisations, about },
        });
        res.status(200).json(updatedStall);
    } catch (error) {
        res.status(500).json({ message: 'Error updating stall data' });
    }
};

export const getAllStalls = async (req: Request, res: Response) => {
    try {
        const stalls = await prisma.stalls.findMany();
        res.status(200).json(stalls);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stalls' });
    }
};
