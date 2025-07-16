import bcrypt from 'bcrypt';
import { prisma } from '../prisma/client';
import { signToken } from '../utils/jwt';
import { Role } from '../generated/prisma';


export async function userRegister(
    name: string,
    email: string,
    password: string,
    role: Role,
    avatar?: string) {

    const emailCheck = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (emailCheck?.email) {
        throw Error('email has been used')
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashed,
            avatar,
            role
        }
    })

    return {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        role: user.role
    }
}

export async function userLogin(
    email: string,
    password: string) {

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw Error('user not found')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw Error('wrong password')
    }

    const token = signToken({
        id: user.id,
        role: user.role,
        email: user.email
    })

    return {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        token
    }

}