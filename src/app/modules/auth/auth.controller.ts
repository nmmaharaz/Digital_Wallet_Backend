/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes"

const authRegister = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const data = await req.body
    const result = await AuthService.authRegister(data)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Auth Created Successfully",
        data: result
    })

})

const authVerify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phone, otp } = await req.body
    await AuthService.authVerify(phone, otp)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Verifyed Successfully",
        data: null
    })

})

const authLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phone, pin } = await req.body
    await AuthService.authLogin(phone, pin)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Send OTP Successfully",
        data: null
    })

})

const authLoginVerify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phone, otp } = await req.body
    const result = await AuthService.authLoginVerify(phone, otp)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Login Successfully",
        data: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            data: result.data
        }
    })

})


export const AuthController = {
    authRegister,
    authVerify,
    authLogin,
    authLoginVerify
}