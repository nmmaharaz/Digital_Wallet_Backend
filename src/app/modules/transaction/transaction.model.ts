import { model, Schema } from "mongoose";
import { ITransaction, TransactionMethod, TransactionStatus, TransactionType } from "./transaction.interface"

const transactionShema = new Schema<ITransaction>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: Object.values(TransactionType)
    },
    amount: { type: Number },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.pending
    },
    from: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    to: { type: Schema.Types.ObjectId, ref: "Wallet" },
    method: {
        type: String,
        enum: Object.values(TransactionMethod)
    },
    transactionId: { type: String, required: true, unique: true }
}, { timestamps: true, versionKey: false })


export const Transaction = model<ITransaction>("Transaction", transactionShema)