import { prisma } from "../prisma/client";
import { UserPayload } from "../utils/jwt";

export async function getProduct(
    sortBy: string,
    order: string,
    minPrice: string,
    maxPrice: string,
    limit: string,
    offset: string,
    minStock: string) {

    const filters: any = {}

    if (minPrice) filters.price = { gte: parseFloat(minPrice as string) }
    if (maxPrice) {
        filters.price = {
            ...(filters.price || {}),
            lte: parseFloat(maxPrice as string)
        }
    }

    const product = await prisma.product.findMany({
        where: {
            ...filters,
            stock: { gte: Number(minStock) },
            deletedAt: null
        },
        orderBy: {
            [sortBy as string]: order as "asc" | "desc"
        },
        take: Number(limit),
        skip: Number(offset),
        select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            image: true,
        }
    })

    const total = await prisma.product.count({
        where: {
            ...filters,
            stock: {
                gte: Number(minStock)
            },
            deletedAt: null,
        },
    })


    return { product, total }

}

export async function getProductAdmin(
    user: UserPayload) {
    const product = await prisma.product.findMany({
        where: {
            ownerId: user.id,
            deletedAt: null
        }
    })

    if (!product) {
        throw Error("product not found")
    }

    return { product }
}

export async function addProductAdmin(
    user: UserPayload,
    name: string,
    price: number,
    stock: number,
    image: string) {

    if (user.role !== 'ADMIN') {
        throw Error("user is not admin")
    }

    const product = await prisma.product.create({
        data: {
            name,
            price,
            stock,
            image,
            createdAt: new Date(),
            ownerId: user.id
        }
    });

    return {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        image: product.image,
        updateAt: product.updatedAt
    }
}

export async function updateProductAdmin(
    user: UserPayload,
    productid: number,
    name: string,
    price: number,
    stock: number,
    image: string) {

    if (user.role !== 'ADMIN') {
        throw Error("user is not admin")
    }

    const product = await prisma.product.findUnique({
        where: {
            id: productid,
            deletedAt: null
        }
    })

    if (!product) {
        throw Error("product not found")
    }

    if (user.id !== product.ownerId) {
        throw Error("cannot update this product")
    }

    const update = await prisma.product.update({
        where: { id: productid },
        data: {
            name,
            price,
            stock,
            image,
            updatedAt: new Date()
        }
    });

    return {
        id: update.id,
        name: update.name,
        price: update.price,
        stock: update.stock,
        image: update.image,
        updateAt: update.updatedAt
    }
}

export async function softDeleteProductAdmin(
    user: UserPayload,
    id: number) {
    if (user.role !== 'ADMIN') {
        throw Error("user is not admin")
    }

    const product = await prisma.product.findUnique({
        where: {
            id
        }
    })

    if (!product) {
        throw Error("product not found")
    }

    if (product.deletedAt !== null) {
        throw Error("already deleted")
    }

    const del = await prisma.product.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    })

    return {
        delete: del
    }
}

export async function getDeleteProductAdmin(
    user: UserPayload) {
    const product = await prisma.product.findMany({
        where: {
            ownerId: user.id,
            deletedAt: {
                not: null
            }
        }
    })

    if (!product) {
        throw Error("product not found")
    }

    return { product }
}

export async function restoreProductAdmin(
    user: UserPayload,
    id: number) {
    if (user.role !== 'ADMIN') {
        throw Error("user is not admin")
    }

    const product = await prisma.product.findUnique({
        where: {
            id: id
        }
    })

    if (!product) {
        throw Error("product not found")
    }

    if (product.deletedAt === null) {
        throw Error("product is not deleted")
    }

    const del = await prisma.product.update({
        where: { id: id },
        data: {
            deletedAt: null
        }
    })

    return {
        delete: del
    }
}

export async function hardDeleteProductAdmin(
    user: UserPayload,
    id: number) {
    if (user.role !== 'ADMIN') {
        throw Error("user is not admin")
    }

    const product = await prisma.product.findUnique({
        where: {
            id
        }
    })

    if (!product) {
        throw Error("product not found")
    }

    if (product.deletedAt === null) {
        throw Error("cannot directly delete product")
    }

    const del = await prisma.$transaction([
        prisma.order.deleteMany({
            where: { productId: id }
        }),
        prisma.product.delete({
            where: { id }
        })
    ]);

    return {
        delete: del
    }
}