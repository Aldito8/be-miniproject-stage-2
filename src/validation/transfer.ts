import Joi from "joi";

export const transferSchema = Joi.object({
    receiverId: Joi.number().positive().required(),
    amount: Joi.number().positive().required()
})