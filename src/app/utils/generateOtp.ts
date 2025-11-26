/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto"
import { redisClient } from "../config/redis.config"

const OTP_EXPIRATION = 2 * 60

const generateOtp = async(length = 6, email: string)=>{
    try{
        const otp = crypto.randomInt(10**(length-1), 10**length).toString()
    const redisKey = `otp:${email}`
    console.log(otp)
    await redisClient.set(redisKey, otp,{
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    })
    return otp
    }catch(err: any){
        throw new Error(err)
    }
}

export default generateOtp