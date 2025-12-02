import { model, Schema } from "mongoose";
import { ApprovalStatus, IsActive, IsVerified, IUser, PermissionLevel, Role } from "./user.interface";

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^(?:\+88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"],
    },
    pin: { type: String, required: true, trim: true },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true
    },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },

    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.INACTIVE,
    },
    nidNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^(\d{10}|\d{13}|\d{17}|\d{19})$/,
        trim: true
    },
    address: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    isVerified: {
        type: String,
        enum: Object.values(IsVerified),
        default: IsVerified.UNVERIFIED,
    },
    shopName: { type: String },
    approvalStatus: {
        type: String,
        enum: Object.values(ApprovalStatus),
        default: function () {
            if (this.role === Role.AGENT) {
                return ApprovalStatus.PENDING;
            }
        }
    },
    totalCommission: { type: Number },
    employeeId: { type: String },
    designation: { type: String },
    permissionLevel: {
        type: String,
        enum: Object.values(PermissionLevel),
    },
    lastLogin: { type: Date },
},{timestamps: true, versionKey: false})


export const User = model<IUser>("User", userSchema) 