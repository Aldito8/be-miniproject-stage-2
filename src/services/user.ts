import { prisma } from "../prisma/client"
import bcrypt from 'bcrypt';
import { UserPayload } from "../utils/jwt";

export async function getAllUser() {
    const user = prisma.user.findMany({
        select: {
            name: true,
            email: true,
            role: true,
            avatar: true,
            points: true
        }
    })

    return user
}

export async function getUserProfile(
    user: UserPayload) {

    const profile = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        select: {
            id: true,
            name: true,
            email: true,
            points: true,
            avatar: true
        }
    })

    return profile
}

export async function updateUserProfilePic(
    user: UserPayload,
    avatar: string) {

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            avatar
        }
    })
}

export async function updatePassword(
    email: string,
    password: string,
    newPassword: string) {

    const profile = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!profile) {
        throw Error("email not registered")
    }

    const isMatch = await bcrypt.compare(password, profile.password)
    if (!isMatch) {
        throw Error("wrong password")
    }

    const isOldPw = await bcrypt.compare(newPassword, profile.password)
    if (isOldPw) {
        throw Error("cannot use old password")
    }

    const hashed = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
        where: {
            id: profile.id
        },
        data: {
            password: hashed
        }
    })
}