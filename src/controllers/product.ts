import { Request, Response } from "express";
import { addProductAdmin, getProduct, getProductAdmin, hardDeleteProductAdmin, restoreProductAdmin, softDeleteProductAdmin, updateProductAdmin } from "../services/product";
import { productSchema } from "../validation/product";


export async function handleGetAllProduct(req: Request, res: Response) {
    try {
        const {
            sortBy = 'updatedAt',
            order = 'asc',
            minPrice = '',
            maxPrice = '',
            limit = '10',
            offset = '0',
            minStock = '0' } = req.query

        const result = await getProduct(
            String(sortBy),
            String(order),
            String(minPrice),
            String(maxPrice),
            String(limit),
            String(offset),
            String(minStock))

        res.status(200).json({ message: "success", result })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export async function handleGetProductAdmin(req: Request, res: Response) {
    try {
        const user = (req as any).user
        if (user.role !== 'ADMIN') {
            throw Error("user is not admin")
        }

        const result = await getProductAdmin(user)
        res.status(200).json({ message: "succes", result })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export async function handleCreateProduct(req: Request, res: Response) {
    try {
        const user = (req as any).user
        if (user.role !== 'ADMIN') {
            throw Error("user is not admin")
        }

        const { error } = productSchema.validate(req.body)
        if (error) {
            throw Error(error.details[0].message)
        }

        const { name, price, stock } = req.body;
        if (!req.file) {
            throw Error("need product image")
        }

        const image = req.file.filename
        const result = await addProductAdmin(
            user,
            name,
            Number(price),
            Number(stock),
            image)

        res.status(200).json({ message: "success", result })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export async function handleUpdateProduct(req: Request, res: Response) {
    try {
        const user = (req as any).user
        if (user.role !== 'ADMIN') {
            throw Error("user is not admin")
        }

        const id = parseInt(req.params.id)
        const { name, price, stock } = req.body;
        if (!req.file) {
            throw Error("need product image")
        }

        const image = req.file.filename
        const result = await updateProductAdmin(
            user,
            id,
            name,
            Number(price),
            Number(stock),
            image)

        res.status(200).json({ message: "success", result })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export async function handleSoftDeleteProduct(req: Request, res: Response) {
    try {
        const user = (req as any).user
        const id = parseInt(req.params.id)
        const deleted = await softDeleteProductAdmin(user, id)
        res.status(200).json({ message: "success", deleted })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export async function handleRestoreSoftDeleteProduct(req: Request, res: Response) {
    try {
        const user = (req as any).user
        const id = parseInt(req.params.id)
        const restore = await restoreProductAdmin(user, id)
        res.status(200).json({ message: "success", restore })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export async function handleHardDeleteProduct(req: Request, res: Response) {
    try {
        const user = (req as any).user
        const id = parseInt(req.params.id)
        const harddel = await hardDeleteProductAdmin(user, id)
        res.status(200).json({ message: "success", harddel })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}