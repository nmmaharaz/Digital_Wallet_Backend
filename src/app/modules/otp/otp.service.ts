import sendEmail from "../../config/nodeMailer"
import AppError from "../../errorHelpers/AppError"
import generateOtp from "../../utils/generateOtp"
import { User } from "../user/user.model"
import httpStatus from "http-status-codes"

const sendOtp = async (phone: string) => {
    const auth = await User.findOne({ phone })
    if (!auth) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    const code = await generateOtp(6, auth.email)
    console.log(code)

    sendEmail({
        to: auth.email,
        subject: "User varification",
        templateName: "email",
        templateData: {
            name: auth.name,
            code
        }
    })
    return null
}

export const OtpServices = {
    sendOtp
}