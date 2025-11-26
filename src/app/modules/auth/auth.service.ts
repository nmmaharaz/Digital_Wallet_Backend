import AppError from "../../errorHelpers/AppError";
import { ApprovalStatus, IUser, Role } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcrypt from "bcrypt"
import { envVars } from "../../config/env";
import sendEmail from "../../config/nodeMailer";
import generateOtp from "../../utils/generateOtp";
import otpVerify from "../../utils/otpVerify";
import createAuthToken from "../../utils/JWT/createAuthToken";

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
    const otp = await generateOtp(6, auth.email)
    sendEmail({
        to: payload.email,
        subject: "User varification",
        templateName: "email",
        templateData: {
            name: payload.name,
            code: otp
        }
    })
    return auth
}

const authVerify = async (phone: string, otp: string) => {

    const { id } = await otpVerify(phone, otp)

    await User.findByIdAndUpdate(id, { isVerified: true }, { runValidators: true })
    return null
}

const authLogin = async (phone: string, pin: string) => {
    const authExist = await User.findOne({ phone })
    if (!authExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    const isExistPin = await bcrypt.compare(pin, authExist.pin)

    if (!isExistPin) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invaild Pin")
    }

    const code =await generateOtp(6, authExist.email)

    sendEmail({
        to: authExist.email,
        subject: "User varification",
        templateName: "email",
        templateData: {
            name: authExist.name,
            code
        }
    })
    return null
}

const authLoginVerify = async (phone: string, otp: string) => {
    const { id } = await otpVerify(phone, otp)
    const auth = await User.findByIdAndUpdate(id, { isVerified: true }, { runValidators: true })
    if (!auth) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invaild Credential")
    }
    const token = createAuthToken(auth)
    return {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        data: auth
    }
}

export const AuthService = {
    authRegister,
    authVerify,
    authLogin,
    authLoginVerify
}