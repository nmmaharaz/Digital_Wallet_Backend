import z from "zod";
import { ITransactionType } from "./transaction.interface";

export const createTransactionZodShema = z.object({
        type: z.enum(Object.values(ITransactionType)),
        amount: z.number().optional(),
        to: z.string(),
        method: z.enum(Object.values(ITransactionType)).optional(),
        note:  z.string().max(20, {message: "Note must be less than 50 characters long"}).optional(),
})