import AppError from "../errorHelpers/AppError"
import { IsActive, IsVerified } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"
import httpStatus from "http-status-codes"

export const checkActiveValidationStatus = async(phone: string) => {
    const authExist = await User.findOne({ phone })
    if (!authExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    if (authExist.isActive !== IsActive.ACTIVE) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User not active")
    }
    if (authExist.isVerified === IsVerified.VERIFIED) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User already logged")
    }

    return authExist
}
