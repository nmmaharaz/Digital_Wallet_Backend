import { Types } from "mongoose";


export enum WalletStatus {
    ACTIVE="ACTIVE",
    BLOCKED="BLOCKED"
}

export interface IWallet {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  balance: number;
  status: WalletStatus;
  lastTransactionAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  totalAdded?: number;
  totalWithdrawn?: number;
  totalSent?: number;
  totalReceived?: number;
  transactionCount?: number;

  totalCashIn?: number;
  totalCashOut?: number;
  commissionRate?: number;
  totalCommissionEarned?: number;
}

