import z from "zod";
import { TransactionType } from "./transaction.interface";

export const createTransactionZodShema = z.object({
        type: z.enum(Object.values(TransactionType)),
        amount: z.number().optional(),
        to: z.string(),
        method: z.enum(Object.values(TransactionType)).optional(),
        note:  z.string().max(20, {message: "Note must be less than 50 characters long"}).optional(),
})

export const tranferVerifyZodSchema = z.object({
    id: z.string(),
    pin: z.string()
        .regex(/^\d{6}$/, { message: "PIN must be a 6-digit number" })
})