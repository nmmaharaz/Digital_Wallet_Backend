import { Types } from "mongoose"
import { userSecarchableFields } from "../../../contant"
import sendEmail from "../../config/nodeMailer"
import AppError from "../../errorHelpers/AppError"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { ITransaction, TransactionMethod, TransactionStatus, TransactionType } from "../transaction/transaction.interface"
import { WalletStatus } from "../wallet/wallet.interface"
import { Wallet } from "../wallet/wallet.model"
import { IsendMoneyVerify, IUser, IuserBlockUnblock, Role } from "./user.interface"
import { User } from "./user.model"
import httpStatus from "http-status-codes"
import { Transaction } from "../transaction/transaction.model"
import { format } from "date-fns"
import { transferValidation } from "../../utils/transfer.validation"
import { transferVerify } from "../../utils/transferVerify.validation"
import { ISSLCommerz } from "../../sslCommerz/sslCommerz.interface"
import { getTransactionId } from "../../utils/getTransactionId"
import { sslCommerzService } from "../../sslCommerz/sslCommerz.service"

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

const addMoney = async (id: Types.ObjectId, amount: string) => {
    const user = await User.findById(id)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    const addMoneyPayload: ISSLCommerz = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        amount: parseFloat(amount),
        transactionId: getTransactionId()
    }

    const payment = await sslCommerzService.sslPaymentInit(addMoneyPayload)


    const transactionPayload: Partial<ITransaction> = {
        user: user.wallet,
        type: TransactionType.add_money,
        amount: addMoneyPayload.amount,
        from: user.wallet,
        transactionId: addMoneyPayload.transactionId,
        method: TransactionMethod.card
    }
    const data = await Transaction.create(transactionPayload)

    return {
        payment: payment,
        data
    }
}

const successMoney = async (query: Record<string, string>) => {
    const session = await Wallet.startSession()
    session.startTransaction()
    try {
        const updateTransaction = await Transaction.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: TransactionStatus.completed },
            { new: true, runValidators: true, session: session }).populate<{ from: { _id: string, balance: number, totalAdded: number } }>("from", "balance totalAdded _id")
        if (!updateTransaction) {
            throw new AppError(httpStatus.BAD_REQUEST, "Payment not found")
        }

        const wallletPayload = {
            balance: updateTransaction.from.balance + updateTransaction.amount,
            totalAdded: updateTransaction.from.totalAdded + updateTransaction.amount,
            lastTransactionAt: new Date()
        }


        const updateWallet = await Wallet.findByIdAndUpdate(
            updateTransaction.from._id,
            wallletPayload,
            { runValidators: true, session: session }
        ).populate<{ user: { name: string, email: string } }>("user", "name email")

        if (!updateWallet) {
            throw new AppError(httpStatus.BAD_REQUEST, "Booking not found")
        }

        // const invoiceData: IInvoiceData = {
        //     userName: (updateBooking.user as unknown as IUser).name,
        //     tourTitle: (updateBooking.tour as unknown as ITour).title,
        //     transactionId: updatedPayment.transactionId,
        //     bookingDate: updateBooking.createdAt as Date,
        //     guestCount: updateBooking.guestCount,
        //     totalAmount: updatedPayment.amount
        // }
        // const pdfBuffer = await generatePdf(invoiceData)
        // const cloudinaryRequest = await uploadBufferToCloudinary(pdfBuffer, "invoice")
        // if(!cloudinaryRequest){
        //     throw new AppError(401, "Error uploading pdf")
        // }
        // await Payment.findByIdAndUpdate(updatedPayment._id, { invoiceUrl: cloudinaryRequest.secure_url }, {runValidators: true, session})

        await sendEmail({
            to: updateWallet.user.email,
            subject: "Money Added Successfully",
            templateName: "sendMoney",
            templateData: {
                recipientName: updateWallet.user.email,
                senderName: updateWallet.user.email,
                amount: updateTransaction.amount,
                currency: "BDT",
                transactionId: updateTransaction.transactionId,
                date: format(updateTransaction.updatedAt, "PPpp"),
                note: "For added money to wallet",
                accountUrl: "https://yourapp.com/account/transactions"
            }
        })

        await session.commitTransaction()
        session.endSession()
        return { success: true, message: "Payment Completed Successfully" }

    } catch (err) {
        await session.abortTransaction()
        session.endSession()
        throw err
    }
}

const failMoney = async (query: Record<string, string>) => {
    await Transaction.findOneAndUpdate(
        { transactionId: query.transactionId },
        { status: TransactionStatus.failed },
        { new: true, runValidators: true })
    return { success: false, message: "Payment Failed" }
}

const cancelMoney = async (query: Record<string, string>) => {
    await Transaction.findOneAndUpdate(
        { transactionId: query.transactionId },
        { status: TransactionStatus.canceled },
        { new: true, runValidators: true })
    return { success: false, message: "Payment Canceled" }
}

export const UserService = {
    getAllUsers,
    getSingleUsers,
    userBlockUnblock,
    userUpdateProfile,
    sendMoney,
    sendMoneyVerify,
    withdrawVerify,
    withdrawMoney,
    addMoney,
    successMoney,
    failMoney,
    cancelMoney
}