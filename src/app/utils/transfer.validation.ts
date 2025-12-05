import AppError from "../errorHelpers/AppError"
import httpStatus from "http-status-codes"
import { WalletStatus } from "../modules/wallet/wallet.interface"
import { getTransactionId } from "./getTransactionId"
import { Types } from "mongoose"
import { User } from "../modules/user/user.model"
import { ITransaction } from "../modules/transaction/transaction.interface"
import { IUser } from "../modules/user/user.interface"
import { Transaction } from "../modules/transaction/transaction.model"

export const transferValidation = async (id: Types.ObjectId, body: ITransaction, to: IUser & {
    wallet: {
        status: WalletStatus;
    }
}) => {
    const from = await User.findById(id).populate<{
        wallet: {
            _id: Types.ObjectId,
            status: WalletStatus
        }
    }>("wallet", "status _id")
    if (!from) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }


    if (id === body.to) {
        throw new AppError(httpStatus.BAD_REQUEST, "You can not send you")
    }

    if (from.wallet.status === WalletStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Your wallet Blocked")
    }
    if (to.wallet.status === WalletStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "Sender wallet Blocked")
    }
    body.from = from.wallet._id
    body.user = id
    body.transactionId = getTransactionId()
    console.log(body);
    console.log(id)
    console.log(from.wallet._id)
    const transaction = await Transaction.create(body)
    return transaction
}