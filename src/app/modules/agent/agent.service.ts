import { Types } from "mongoose";
import { transferValidation } from "../../utils/transfer.validation";
import { ITransaction, TransactionStatus } from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";
import { WalletStatus } from "../wallet/wallet.interface";
import { IsendMoneyVerify, IUser } from "../user/user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { transferVerify } from "../../utils/transferVerify.validation";
import { Wallet } from "../wallet/wallet.model";
import sendEmail from "../../config/nodeMailer";
import { format } from "date-fns";

const cashIn = async (id: Types.ObjectId, body: ITransaction, to: IUser & {
    wallet: {
        status: WalletStatus;
    }
}) => {
   
    const data = await transferValidation(id, body, to)
    if(!data){
        throw new AppError(httpStatus.BAD_REQUEST, "Data not found")
    }
    const transaction = await Transaction.create(data)

    return transaction
}

const cashInVerify = async (id: Types.ObjectId, body: IsendMoneyVerify) => {
    const session = await Transaction.startSession()
    session.startTransaction()

    try {
        const {transaction, to, user} = await transferVerify(id, body)

        const result = await Transaction.findByIdAndUpdate(body.id, { status: TransactionStatus.completed }, { new: true, runValidators: true, session })
        
        const fromPayload = {
            balance: transaction.from.balance - transaction.amount,
            totalCashIn: transaction.from.totalCashIn as number + transaction.amount,
            lastTransactionAt: new Date()
        }
        await Wallet.findByIdAndUpdate(
            transaction.from._id,
            fromPayload,
            {
                runValidators: true,
                session
            }
        )


        const toPayload = {
            balance: transaction.to.balance + transaction.amount,
            totalReceived: transaction.to.totalReceived as number + transaction.amount,
            lastTransactionAt: new Date()
        }

        await Wallet.findByIdAndUpdate(
            transaction.to._id,
            toPayload,
            {
                runValidators: true,
                session
            }
        )

        await session.commitTransaction()
        session.endSession()

        sendEmail({
            to: to.email,
            subject: "Payment Received Successfully",
            templateName: "sendMoney",
            templateData: {
                recipientName: to.name,
                senderName: user.name,
                amount: transaction.amount,
                currency: "BDT",
                transactionId: transaction.transactionId,
                date: format(transaction.updatedAt, "PPpp"),
                note: "For dinner",
                accountUrl: "https://yourapp.com/account/transactions"
            }
        })

        return result
    } catch (error) {
        session.abortTransaction()
        session.endSession()
        await Transaction.findByIdAndUpdate(body.id, { status: TransactionStatus.failed }, { new: true, runValidators: true })
        throw error
    }
}

export const AgentService = {
    cashIn,
    cashInVerify
}