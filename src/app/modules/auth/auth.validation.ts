import z from "zod";
import { Role } from "../user/user.interface";

export const registerAuthZodSchema = z.object({
    name: z.string({ error: "Name must be string" }).min(3, "Name must be at least 2 characters long").max(50, "Name must be less than 50 characters long"),
    email: z.string({ error: "Email must be string" }).email("Invalid email address").min(5, "Email must be at least 5 characters long").max(100, "Email must be less than 50 characters long"),
    phone: z.string().regex(/^(\+88|88)?01[3-9]\d{8}$/, { message: "Invalid Bangladeshi phone number" }),
    pin: z.string()
        .regex(/^\d{6}$/, { message: "PIN must be a 6-digit number" }),
    role: z.enum(Object.values(Role)),
    // wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },

    // isActive: {
    //     type: String,
    //     enum: Object.values(IsActive),
    //     default: IsActive.ACTIVE,
    // },

    nidNumber: z
        .string()
        .trim()
        .regex(/^(\d{10}|\d{13}|\d{17}|\d{19})$/, {
            message: "NID number must be 10, 13, 17, or 19 digits only",
        })
    // .required({
    //     nidNumber: true,
    // })
    ,
    address: z.string(),
    dateOfBirth: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }),
    // isVerified: {
    //     type: Boolean,
    //     default: false,
    // },

    shopName: z.string().optional(),
    // approvalStatus: {
    //     type: String,
    //     enum: Object.values(ApprovalStatus)
    // },
    // commissionRate: { type: parent },
    // totalCommission: { type: Number }, // optional (O)

    // employeeId: { type: String },
    // designation: { type: String },
    // permissionLevel: {
    //     type: String,
    //     enum: Object.values(PermissionLevel),
    // },
    // lastLogin: { type: Date },
}).refine((data) => {
    if (data.role === Role.AGENT) {
        return data.shopName
    }
    return true
}, {
    message: "Agent must provider your shopname",
    path: ["shopName"]
})



export const authLoginZodSchema = z.object({
    phone: z.string().regex(/^(\+88|88)?01[3-9]\d{8}$/, { message: "Invalid Bangladeshi phone number" }),
    pin: z.string()
        .regex(/^\d{6}$/, { message: "PIN must be a 6-digit number" }),
})

export const VerifyOTPZodSchema = z.object({
    phone: z.string().regex(/^(\+88|88)?01[3-9]\d{8}$/, { message: "Invalid Bangladeshi phone number" }),
    otp: z.string()
        .regex(/^\d{6}$/, { message: "otp must be a 6-digit number" }),
})

export const changePinZodSchema = z.object({
    oldPin: z.string()
        .regex(/^\d{6}$/, { message: "Invaild Old Pin" }),
    newPin: z.string()
        .regex(/^\d{6}$/, { message: "New pin must be a 6-digit number" }),
    confirmPin: z.string()
        .regex(/^\d{6}$/, { message: "PIN must be a 6-digit number" }),
})  