import { model, Schema } from "mongoose";
import {ITransaction, ITransactionMethod, ITransactionStatus, ITransactionType} from "./transaction.interface"

const transactionShema = new Schema({
        user: {type: Schema.Types.ObjectId, ref:"User"},
        type: {type: String,
            enum: Object.values(ITransactionType)
        },
        amount: {type: Number},
        status: {
            type: String,
            enum: Object.values(ITransactionStatus),
            default: ITransactionStatus.pending
        },
        from: {type: Schema.Types.ObjectId, ref: "User", required: true},
        to: {type: Schema.Types.ObjectId, ref: "User", required: true},
        method: {
            type: String, 
            enum: Object.values(ITransactionMethod)
        },
})


export const Transaction = model<ITransaction>("Transaction", transactionShema)