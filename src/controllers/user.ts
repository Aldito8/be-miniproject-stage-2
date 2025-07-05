import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { passwordUpdateSchema } from "../validation/auth";
import { getAllUser, getUserProfile, updatePassword, updateUserProfilePic } from "../services/user";


export async function handleGetAllUser(req: Request, res: Response) {
    try {
        const result = await getAllUser()
        res.status(200).json({ message: "success", result })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export async function handleGetUserProfile(req: Request, res: Response) {
    try {
        const user = (req as any).user
        const result = await getUserProfile(user)
        res.status(200).json({ message: "success", result })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export async function handleUpdateUserProfilePic(req: Request, res: Response) {
    try {
        const user = (req as any).user
        if (!req.file) {
            throw Error("need picture to upload")
        }

        const avatar = req.file.filename
        await updateUserProfilePic(user, avatar)
        res.status(200).json({ message: "success" })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export async function handleUpdateUserPassword(req: Request, res: Response) {
    try {
        const { email, password, newPassword } = req.body
        const { error } = passwordUpdateSchema.validate(req.body)
        if (error) {
            throw Error(error.details[0].message)
        }

        await updatePassword(email, password, newPassword)
        res.status(200).json({ message: "success" })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}