import { Types } from "mongoose";

export enum TransactionType {
    add_money = "add_money",
    withdraw = "withdraw",
    send_money = "send_money",
    cash_in = "cash_in"
}
export enum TransactionStatus {
    pending = "pending",
    completed = "completed",
    canceled = "canceled",
    failed = "failed"
}
export enum TransactionMethod {
    bank = "bank",
    card = "card",
}


export interface ITransaction extends Document {
    user?: Types.ObjectId;
    type: TransactionType;
    amount: number;
    status?: TransactionStatus;
    from?: Types.ObjectId;
    to: Types.ObjectId;
    method?: TransactionMethod;
    note?: string;
    transactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}
