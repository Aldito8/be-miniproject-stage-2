import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export function authenticate(
    req: Request,
    res: Response,
    next: NextFunction) {
    try {
        const token = req.cookies.token
        if (!token) {
            throw Error("unauthorized")
        }

        const user = verifyToken(token);

        (req as any).user = user
        next()

    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}