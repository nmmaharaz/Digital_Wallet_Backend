import AppError from "../errorHelpers/AppError"
import bcrypt from "bcrypt"
import { User } from "../modules/user/user.model"
import httpStatus from "http-status-codes"
import { Transaction } from "../modules/transaction/transaction.model"
import { IWallet } from "../modules/wallet/wallet.interface"
import { Types } from "mongoose"
import { IsendMoneyVerify } from "../modules/user/user.interface"

export const transferVerify = async (id: Types.ObjectId, body: IsendMoneyVerify) => {
    const user = await User.findById(id)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    const matchPin = await bcrypt.compare(body.pin, user.pin)

    if (!matchPin) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incurrect Pin")
    }

    const transaction = await Transaction.findById(body.id)
        .populate<{ to: IWallet }>("to")
        .populate<{ from: IWallet }>("from")
    if (!transaction) {
        throw new AppError(httpStatus.BAD_REQUEST, "Can not found Transaction Information")
    }

    const to = await User.findById(transaction.to.user)
    if (!to) {
        throw new AppError(httpStatus.NOT_FOUND, "Sender not found")
    }
    if (transaction.user?.toString() !== user._id.toString()) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Jini transaction create koreche take korte hobe")
    }
    if (transaction.amount > transaction.from.balance) {
        throw new AppError(httpStatus.BAD_REQUEST, "Not Available balance")
    }


    return {
        transaction,
        to, 
        user
    }

}