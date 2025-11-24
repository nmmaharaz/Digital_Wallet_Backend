import { Types } from "mongoose";

export enum Role {
    USER = "USER",
    AGENT = "AGENT",
    ADMIN = "ADMIN"
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export enum ApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    SUSPENDED = "SUSPENDED"
}

export enum PermissionLevel {
    SUPER = "SUPER",
    MANAGER = "MANAGER",
    SUPPORT = "SUPPORT"
}

export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    pin: string;
    role: Role;
    wallet?: Types.ObjectId;

    isActive?: IsActive;
    nidNumber: string;
    address: string;
    dateOfBirth: Date;
    isVerified?: boolean;

    shopName?: string;
    approvalStatus?: ApprovalStatus;
    commissionRate?: number;
    totalCommission?: number; 

    employeeId?: string;
    designation?: string;
    permissionLevel?: PermissionLevel
    lastLogin?: Date;
}
