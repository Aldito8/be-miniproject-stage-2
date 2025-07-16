import { Request, Response } from "express";
import { orderSchema } from "../validation/product";
import { getAllUserOrder, getUserOrder, userCreateOrder } from "../services/order";

export async function handleGetAllUserOrder(req: Request, res: Response) {
    try {
        const user = (req as any).user
        if (user.role !== "ADMIN") {
            throw Error("user cannot access")
        }

        const {
            sortBy = 'updatedAt',
            order = '',
            minOrder = '',
            maxOrder = '',
            limit = '10',
            offset = '0' } = req.query

        const result = await getAllUserOrder()

        res.status(200).json({ message: "success", result })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export async function handleGetUserOrder(req: Request, res: Response) {
    try {
        const {
            sortBy = 'quantity',
            order = 'desc',
            minQuantity = '',
            maxQuantity = '',
            minTotal = '',
            maxTotal = '',
            limit = '100',
            offset = '0' } = req.query

        const user = (req as any).user
        const result = await getUserOrder(
            user,
            String(sortBy),
            String(order),
            String(minQuantity),
            String(maxQuantity),
            String(minTotal),
            String(maxTotal),
            String(limit),
            String(offset))

        res.status(200).json({ message: "success", result })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export async function handleCreateOrder(req: Request, res: Response) {
    try {
        const user = (req as any).user
        const { error } = orderSchema.validate(req.body)
        if (error) {
            throw Error(error.details[0].message)
        }

        const { productId, quantity } = req.body
        const order = await userCreateOrder(user, productId, quantity)
        res.status(201).json({ message: "success", order });
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}