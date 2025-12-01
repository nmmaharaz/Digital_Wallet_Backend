import { Types } from "mongoose";

export enum ITransactionType {
    add_money = "add_money",
    withdraw = "withdraw",
    send_money = "send_money"
}
export enum ITransactionStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum ITransactionMethod {
    bank = "bank",
    card = "card",
}


export interface ITransaction extends Document {
    user: Types.ObjectId;
    type: ITransactionType;
    amount: number;
    status: ITransactionStatus;
    from?: Types.ObjectId;
    to?: Types.ObjectId;
    method?: ITransactionMethod;
    note?: string;
    createdAt: Date;
    updatedAt: Date;
}
