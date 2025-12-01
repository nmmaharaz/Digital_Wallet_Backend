import { model, Schema, Types } from "mongoose";
import { IWallet, WalletStatus } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    balance: {
      type: Number,
      default: 50,
      min: [0, "Balance cannot be negative"]
    },
    status: {
      type: String,
      enum: Object.values(WalletStatus),
      default: WalletStatus.ACTIVE
    },
    lastTransactionAt: { type: Date },

    totalAdded: { type: Number, default: 0 },
    totalWithdrawn: { type: Number, default: 0 },
    totalSent: { type: Number, default: 0 },
    totalReceived: { type: Number, default: 0 },
    transactionCount: { type: Number, default: 0 },

    totalCashIn: { type: Number, default: 0 },
    totalCashOut: { type: Number, default: 0 },
    totalCommissionEarned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Wallet = model<IWallet>('Wallet', walletSchema);
