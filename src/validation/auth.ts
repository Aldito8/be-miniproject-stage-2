import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    avatar: Joi.string().optional().allow("", null),
    role: Joi.string().optional()
})

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

export const passwordUpdateSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
})