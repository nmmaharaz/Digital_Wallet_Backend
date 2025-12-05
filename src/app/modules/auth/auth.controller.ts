/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import createAuthToken from "../../utils/JWT/createAuthToken";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IsVerified } from "../user/user.interface";

const authRegister = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const body =await req.body
    const payload ={
        ...body,
        photo: req.file?.path
    }
    const result = await AuthService.authRegister(payload)
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
        statusCode: httpStatus.OK,
        message: "Verifyed Successfully",
        data: null
    })
})

const authLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phone, pin } = await req.body
    await AuthService.authLogin(phone, pin)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Send OTP Successfully",
        data: null
    })
})

const authLogout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.user
    await User.findByIdAndUpdate(token?.userId, { isVerified: IsVerified.UNVERIFIED }, { new: true })

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User Logged Out Successfully",
        data: null
    })
})

const authLoginVerify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phone, otp } = await req.body
    const auth = await AuthService.authLoginVerify(phone, otp)
    if (!auth) {
        throw new AppError(httpStatus.BAD_REQUEST, "Login Failed")
    }
    const token = createAuthToken(res, auth)
    const { pin, ...data } = auth
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Login Successfully",
        data: {
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            data
        }
    })
})

const authMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.user
    const data = await AuthService.authMe(token)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User retrieved successfully",
        data
    })
})

const changePin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.user
    const { oldPin, newPin, confirmPin } = await req.body
    const data = await AuthService.changePin(oldPin, newPin, confirmPin, token)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Change Pin successfully",
        data
    })
})

const forgotPin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { phone } = await req.body
    await AuthService.forgotPin(phone)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Forgot Message Send successfully",
        data: null
    })
})


export const AuthController = {
    authRegister,
    authVerify,
    authLogin,
    authLogout,
    authLoginVerify,
    authMe,
    changePin,
    forgotPin
}