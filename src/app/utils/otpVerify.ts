import { redisClient } from "../config/redis.config"
import AppError from "../errorHelpers/AppError"
import { User } from "../modules/user/user.model"
import httpStatus from "http-status-codes"

const otpVerify = async(phone: string, otp: string) =>{
       const authExist = await User.findOne({ phone })
        if (!authExist) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found")
        }
    
        const redisKey = `otp:${authExist.email}`
        const storeOtp = await redisClient.get(redisKey)
    
        if (!storeOtp) {
            throw new AppError(httpStatus.BAD_REQUEST, "OTP has expired or does not exist")
        }
    
        if (otp !== storeOtp) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP")
        }
    
        await redisClient.del(redisKey)
        return {
            email: authExist.email,
            id: authExist._id
        }
}

export default otpVerify