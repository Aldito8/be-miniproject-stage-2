import { prisma } from "../prisma/client"
import { UserPayload } from "../utils/jwt";

export async function getAllUserOrder() {
    const ordersGrouped = await prisma.order.groupBy({
        by: ['buyerId'],
        _count: { id: true },
        _sum: {
            quantity: true,
            total: true
        }
    });

    const userIds = ordersGrouped.map(o => o.buyerId);

    const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: {
            id: true,
            name: true
        }
    });

    const allOrders = await prisma.order.findMany({
        where: {
            buyerId: { in: userIds }
        },
        select: {
            buyerId: true,
            quantity: true,
            product: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    const userProductsMap: {
        [buyerId: number]: { id: number; name: string; quantity: number }[];
    } = {};

    for (const order of allOrders) {
        const buyerId = order.buyerId;
        const product = order.product;

        if (!userProductsMap[buyerId]) {
            userProductsMap[buyerId] = [];
        }

        if (!userProductsMap[buyerId][product.id]) {
            userProductsMap[buyerId][product.id] = {
                id: product.id,
                name: product.name,
                quantity: 0
            };
        }

        userProductsMap[buyerId][product.id].quantity += order.quantity;
    }

    const result = ordersGrouped.map(orderGroup => {
        const user = users.find(u => u.id === orderGroup.buyerId);
        const productMap = userProductsMap[orderGroup.buyerId] || {};
        const products = Object.values(productMap);

        return {
            user: {
                id: user?.id,
                name: user?.name,
            },
            totalOrder: orderGroup._count.id,
            totalQuantity: orderGroup._sum.quantity || 0,
            totalSpent: orderGroup._sum.total || 0,
            products
        };
    });

    return result;
}



export async function getUserOrder(
    user: UserPayload,
    sortBy: string,
    order: string,
    minQuantity: string,
    maxQuantity: string,
    minTotal: string,
    maxTotal: string,
    limit: string,
    offset: string) {

    const filters: any = {}

    if (minQuantity) {
        filters.quantity = { gte: parseInt(minQuantity as string) }
    }

    if (maxQuantity) {
        filters.quantity = {
            ...(filters.quantity || {}),
            lte: parseInt(maxQuantity as string)
        }
    }

    if (minTotal) {
        filters.total = { gte: parseFloat(minTotal as string) }
    }

    if (maxTotal) {
        filters.total = {
            ...(filters.total || {}),
            lte: parseFloat(maxTotal as string)
        }
    }

    const orders = await prisma.order.findMany({
        where: {
            ...filters,
            buyerId: user.id
        },
        orderBy: {
            [sortBy as string]: order as "asc" | "desc"
        },
        take: Number(limit),
        skip: Number(offset),
        select: {
            quantity: true,
            total: true,
            createdAt: true,
            product: {
                select: {
                    name: true,
                    price: true
                },
            }
        }
    })

    if (order.length <= 0) {
        throw Error("no order yet")
    }

    return orders
}

export async function userCreateOrder(
    user: UserPayload,
    productId: number,
    quantity: number) {

    const product = await prisma.product.findUnique({ where: { id: Number(productId) } })
    if (!product) {
        throw Error("product not found")
    }

    if (product.stock < quantity) {
        throw Error("insufficient stock")
    }

    const total = quantity * product.price
    const divisor = Number(process.env.DIVISOR_POINT as string)
    const points = total / divisor
    const [order, userPoint, productStock] = await prisma.$transaction([
        prisma.order.create({
            data: {
                productId: productId,
                quantity: quantity,
                total,
                buyerId: user.id
            }
        }),

        prisma.user.update({
            where: { id: user.id },
            data: {
                points: {
                    increment: points
                }
            }
        }),

        prisma.product.update({
            where: { id: product.id },
            data: {
                stock: {
                    decrement: quantity
                }
            }
        })
    ])

    return { order, points }
}
