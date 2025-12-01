import { Types } from "mongoose";


export enum WalletStatus {
    ACTIVE="ACTIVE",
    BLOCKED="BLOCKED"
}

export interface IWallet {
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
  totalCommissionEarned?: number;
}

