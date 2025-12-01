import z from "zod";
import { ApprovalStatus, IsActive } from "./user.interface";

export const userBlockUnblockZodSchema = z.object({
    isActive: z.enum(Object.values(IsActive)).optional(),
    status: z.enum(Object.values(IsActive)).optional(),
    approvalStatus: z.enum(Object.values(ApprovalStatus)).optional()
})


export const userUpdateProfileZodSchema = z.object({
    name: z.string({ error: "Name must be string" }).min(3, "Name must be at least 2 characters long").max(50, "Name must be less than 50 characters long").optional(),
    nidNumber: z
        .string()
        .trim()
        .regex(/^(\d{10}|\d{13}|\d{17}|\d{19})$/, {
            message: "NID number must be 10, 13, 17, or 19 digits only",
        }).optional(),
    address: z.string().optional(),
    dateOfBirth: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }).optional(),

    shopName: z.string().optional(),
})

