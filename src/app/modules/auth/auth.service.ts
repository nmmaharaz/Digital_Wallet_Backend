import AppError from "../../errorHelpers/AppError";
import { ApprovalStatus, IsActive, IsVerified, IUser, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcrypt from "bcrypt"
import { envVars } from "../../config/env";
import sendEmail from "../../config/nodeMailer";
import otpVerify from "../../utils/otpVerify";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken"
import { Wallet } from "../wallet/wallet.model";
import { checkActiveValidationStatus } from "../../utils/authValidation";

const authRegister = async (payload: IUser) => {
    const authExist = await User.findOne({ email: payload.email })
    if (authExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exist")
    }
    if (payload.role === Role.AGENT) {
        payload = { ...payload, approvalStatus: ApprovalStatus.PENDING }
    }

    const hashPin = await bcrypt.hash(payload.pin, Number(envVars.BCRYPT_SALT_ROUND))
    payload.pin = hashPin

    const auth = await User.create(payload)
    return auth
}

const authVerify = async (phone: string, otp: string) => {
    const authExist = await User.findOne({ phone })
    if (!authExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    if (authExist.isActive !== IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User Already ${authExist.isActive}`)
    }
    const { id } = await otpVerify(phone, otp)

    const walletData = {
        user: authExist?._id,
        lastTransactionAt: new Date()
    }
    
    const wallet = await Wallet.create(walletData)
    await User.findByIdAndUpdate(id, { wallet: wallet._id,isActive: IsActive.ACTIVE }, { runValidators: true })
    return null
}

const authLogin = async (phone: string, pin: string) => {
    console.log("jdsklfjd")
    const authExist = await checkActiveValidationStatus(phone)

    const isExistPin = await bcrypt.compare(pin, authExist.pin)

    if (!isExistPin) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invaild Pin")
    }

    await User.findByIdAndUpdate(authExist._id, { isVerified: IsVerified.PENDING }, { new: true })

    return null
}

const authLoginVerify = async (phone: string, otp: string) => {
    const authExist = await checkActiveValidationStatus(phone)

    if (authExist.isVerified !== IsVerified.PENDING) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Please provide user login info")
    }

    const { id } = await otpVerify(phone, otp)
    const auth = await User.findByIdAndUpdate(id, { isVerified: IsVerified.VERIFIED }, { runValidators: true })

    if (!auth) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invaild Credential")
    }

    return auth
}
const authMe = async (token: JwtPayload) => {
    const result = await User.findById(token.userId)
    return result
}

const changePin = async (oldPin: string, newPin: string, confirmPin: string, token: JwtPayload) => {
    const authExist = await User.findById(token.userId)
    if (!authExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    const matchPassword = bcrypt.compare(oldPin, authExist.pin)

    if (!matchPassword) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invaild Pin")
    }
    if (newPin !== confirmPin) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incurrect update password")
    }

    const hashNewPin = await bcrypt.hash(newPin, Number(envVars.BCRYPT_SALT_ROUND))
    authExist.pin = hashNewPin
    authExist.save()
    return null
}

const forgotPin = async (phone: string) => {
    const authExist = await User.findOne({ phone })
    if (!authExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }
    if (authExist.isActive === IsActive.BLOCKED || authExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${authExist.isActive}`);
    }
    if (authExist.isVerified !== IsVerified.VERIFIED) {
        throw new AppError(httpStatus.BAD_REQUEST, `User can not varified`);
    }

    const jwtPayload = {
        userId: authExist._id,
        phone: authExist.phone,
        role: authExist.role
    }
    const resetToken = await jwt.sign(jwtPayload, envVars.JWT.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    })
    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?userId=${authExist._id}&token=${resetToken}`;
    sendEmail({
        to: authExist.email,
        subject: "Forgot Password",
        templateName: "forgotPassword",
        templateData: {
            name: authExist.name,
            resetUILink
        }
    })
}

export const AuthService = {
    authRegister,
    authVerify,
    authLogin,
    authLoginVerify,
    authMe,
    changePin,
    forgotPin
}