import { Types } from "mongoose"
import { userSecarchableFields } from "../../../contant"
import sendEmail from "../../config/nodeMailer"
import AppError from "../../errorHelpers/AppError"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { ITransaction, TransactionStatus } from "../transaction/transaction.interface"
import { WalletStatus } from "../wallet/wallet.interface"
import { Wallet } from "../wallet/wallet.model"
import { IsendMoneyVerify, IUser, IuserBlockUnblock, Role } from "./user.interface"
import { User } from "./user.model"
import httpStatus from "http-status-codes"
import { Transaction } from "../transaction/transaction.model"
import { format } from "date-fns"
import { transferValidation } from "../../utils/transfer.validation"
import { transferVerify } from "../../utils/transferVerify.validation"

const getAllUsers = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find().populate("wallet", "balance -_id"), query)

    const user = await queryBuilder
        .search(userSecarchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        user.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const getSingleUsers = async (id: string) => {
    const data = await User.findById(id)
    return data
}

const userBlockUnblock = async (id: string, body: IuserBlockUnblock) => {
    let finalStatus: string | null = ""
    let email: string | null = ""

    if (body.isActive !== undefined) {
        const auth = await User.findByIdAndUpdate(id, { isActive: body.isActive }, { new: true })
        if (!auth) {
            throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong");
        }
        email = auth?.email
        finalStatus = body.isActive
    }
    if (body.approvalStatus !== undefined) {
        const auth = await User.findByIdAndUpdate(id, { approvalStatus: body.approvalStatus }, { new: true })
        if (!auth || auth.role !== Role.AGENT) {
            throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong");
        }
        email = auth?.email
        finalStatus = body.approvalStatus
    }
    if (body.status !== undefined) {
        console.log("mama aschila")
        const wallet = await Wallet.findByIdAndUpdate(id, { status: body.status }, { new: true, runValidators: true }).populate<{ user: { email: string } }>("user", "email -_id")
        if (!wallet) {
            throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong");
        }
        email = wallet.user.email
        finalStatus = body.status
    }

    sendEmail({
        to: email,
        subject: "User varification",
        templateName: "blockUnblock",
        templateData: {
            name: "Nadimul Mawla Meheraj",
            status: finalStatus,
            reason: "Policy violation",
            link: "https://your-app.com/appeal"
        }
    })
}


const userUpdateProfile = async (id: string, body: Partial<IUser>) => {
    const data = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true })

    return data
}


// Send Money
const sendMoney = async (id: Types.ObjectId, body: ITransaction, to: IUser & {
    wallet: {
        status: WalletStatus;
    }
}) => {
    const data = await transferValidation(id, body, to)
    return data
}


const sendMoneyVerify = async (id: Types.ObjectId, body: IsendMoneyVerify) => {
    const session = await Transaction.startSession()
    session.startTransaction()

    try {
        const { transaction, to, user } = await transferVerify(id, body)

        const result = await Transaction.findByIdAndUpdate(body.id, { status: TransactionStatus.completed }, { new: true, runValidators: true, session })

        const fromPayload = {
            balance: transaction.from.balance - transaction.amount,
            totalSent: transaction.from.totalSent as number + transaction.amount,
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

// Withdraw Money
const withdrawMoney = async (id: Types.ObjectId, body: ITransaction, to: IUser & {
    wallet: {
        status: WalletStatus;
    }
}) => {
    const data = await transferValidation(id, body, to)
    return data
}

const withdrawVerify = async (id: Types.ObjectId, body: IsendMoneyVerify) => {
    const session = await Transaction.startSession()
    session.startTransaction()

    try {
        const { transaction, to, user } = await transferVerify(id, body)

        const result = await Transaction.findByIdAndUpdate(body.id, { status: TransactionStatus.completed }, { new: true, runValidators: true, session })

        const fromPayload = {
            balance: transaction.from.balance - transaction.amount,
            totalWithdrawn: transaction.from.totalWithdrawn as number + transaction.amount,
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
            totalCommissionEarned: (transaction.to.commissionRate as number * transaction.amount) / 100,
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

export const UserService = {
    getAllUsers,
    getSingleUsers,
    userBlockUnblock,
    userUpdateProfile,
    sendMoney,
    sendMoneyVerify,
    withdrawVerify,
    withdrawMoney
}