import z from "zod";

export const  sendOtpZodSchema = z.object({
    phone: z.string().regex(/^(\+88|88)?01[3-9]\d{8}$/, { message: "Invalid Bangladeshi phone number" }),
})

