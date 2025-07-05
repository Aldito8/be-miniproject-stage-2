import { Request, Response } from "express";
import { transferPoints } from "../services/transfer";
import { transferSchema } from "../validation/transfer";


export async function handleUserTransferPoint(req: Request, res: Response) {
    try {
        const sender = (req as any).user;

        const { error } = transferSchema.validate(req.body)
        if (error) {
            throw Error(error.details[0].message)
        }
        const { receiverId, amount } = req.body;

        await transferPoints(sender.id, receiverId, amount);

        res.status(200).json({ message: `Transfer ${amount} point success send to user ${receiverId}` });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};