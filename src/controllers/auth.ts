import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validation/auth";
import { userLogin, userRegister } from "../services/auth";

export async function handleRegister(req: Request, res: Response) {
    try {
        const { error } = registerSchema.validate(req.body)
        if (error) {
            throw Error(error.details[0].message)
        }

        const { name, email, password, role } = req.body
        let avatar: string | undefined;
        if (req.file) {
            avatar = req.file.filename
        }

        const result = await userRegister(name, email, password, role, avatar)
        res.status(200).json({ message: 'success register', result })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export async function handleLogin(req: Request, res: Response) {
    try {
        const { error } = loginSchema.validate(req.body)
        if (error) {
            throw Error(error.details[0].message)
        }

        const { email, password } = req.body
        const result = await userLogin(email, password)
        res.cookie('token', result.token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24
        });

        const { token, ...data } = result
        res.status(200).json({ message: 'success login', ...data })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export async function handleLogout(req: Request, res: Response) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
        });

        res.status(200).json({ message: "success logout" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}