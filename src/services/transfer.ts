import { prisma } from "../prisma/client";

export async function transferPoints(
    senderId: number,
    receiverId: number,
    amount: number
) {
    if (senderId === receiverId) {
        throw new Error("cannot transfer to yourself");
    }

    const [sender, receiver] = await Promise.all([
        prisma.user.findUnique({
            where: {
                id: senderId
            }
        }),
        prisma.user.findUnique({
            where: {
                id: receiverId
            }
        }),
    ]);

    if (!sender || !receiver) {
        throw new Error("sender or receiver not found");
    }

    if (sender.points < amount) {
        throw new Error("point not enough");
    }

    await prisma.$transaction([
        prisma.transfer.create({
            data: {
                senderId,
                receiverId,
                amount
            }
        }),
        prisma.user.update({
            where: { id: senderId },
            data: {
                points: {
                    decrement: amount,
                }
            }
        }),
        prisma.user.update({
            where: { id: receiverId },
            data: {
                points: {
                    increment: amount,
                }
            }
        })
    ])
}
