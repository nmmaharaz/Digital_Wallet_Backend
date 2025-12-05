import { Types } from "mongoose";
import { WalletStatus } from "../wallet/wallet.interface";

export enum Role {
    USER = "USER",
    AGENT = "AGENT",
    ADMIN = "ADMIN",
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export enum IsVerified {
    UNVERIFIED = "UNVERIFIED",
    PENDING = "PENDING",
    VERIFIED = "VERIFIED"
}

export enum ApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    SUSPENDED = "SUSPENDED"
}

export enum PermissionLevel {
    SUPER = "SUPER",
    ADMIN = "ADMIN",
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
    photo?: string;
    wallet?: Types.ObjectId;

    isActive?: IsActive;
    nidNumber: string;
    address: string;
    dateOfBirth: Date;
    isVerified?: IsVerified;

    shopName?: string;
    approvalStatus?: ApprovalStatus;
    totalCommission?: number;

    employeeId?: string;
    designation?: string;
    permissionLevel?: PermissionLevel
    lastLogin?: Date;
}


export interface IuserBlockUnblock {
    isActive?: IsActive;
    status?: WalletStatus;
    approvalStatus?: ApprovalStatus;
}

export interface IsendMoneyVerify {
    id: string,
    pin: string
}


export type IUserWithWalletStatus = IUser & {
    wallet: {
        status: WalletStatus;
    };
};