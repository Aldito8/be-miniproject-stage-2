import Joi from "joi";

export const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().positive().required()
})

export const orderSchema = Joi.object({
    productId: Joi.number().positive().required(),
    quantity: Joi.number().positive().required()
})