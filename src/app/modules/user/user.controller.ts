/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { UserService } from "./user.service";
import AppError from "../../errorHelpers/AppError";
import { User } from "./user.model";
import { JwtPayload } from "jsonwebtoken";
import { IUser, PermissionLevel, Role } from "./user.interface";
import { WalletStatus } from "../wallet/wallet.interface";

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.getAllUsers(req.query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Otp Send Successfully",
        data: user.data,
        meta: user.meta
    })
})

const getSingleUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const user = await UserService.getSingleUsers(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Otp Send Successfully",
        data: user,
    })
})

const userBlockUnblock = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.user as JwtPayload
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User can not authorized")
    }
    const user = await User.findById(token.userId)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    if (user.role === Role.ADMIN) {
        if (user.permissionLevel === PermissionLevel.SUPPORT) {
            throw new AppError(httpStatus.UNAUTHORIZED, "User can not authorized")
        }
    }

    const { id } = req.params
    const body = req.body
    await UserService.userBlockUnblock(id, body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Update Successfully",
        data: null,
    })
})

const userUpdateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.user as JwtPayload
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User can not authorized")
    }
    const body = req.body
    await UserService.userUpdateProfile(token.userId, body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Update Successfully",
        data: null,
    })
})


// Send Money
const sendMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.user as JwtPayload
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User can not authorized")
    }
    const body = req.body
    const to = await User.findOne({ wallet: body.to }).populate<{ wallet: { status: WalletStatus } }>("wallet", "status -_id").lean<IUser & { wallet: { status: WalletStatus } }>()
    if (!to) {
        throw new AppError(httpStatus.NOT_FOUND, "Sender user not found")
    }
    if (to.role !== Role.USER) {
        throw new AppError(httpStatus.NOT_FOUND, "Send Money only user")
    }
    const data = await UserService.sendMoney(token.userId, body, to)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Send Money Transaction created",
        data,
    })
})

const sendMoneyVerify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.user as JwtPayload
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User can not authorized")
    }
    const body = req.body
    const data = await UserService.sendMoneyVerify(token.userId, body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Send Money Transaction created",
        data,
    })
})
// Withdraw Money
const withdrawMoney = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.user as JwtPayload
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User can not authorized")
    }
    const body = req.body
    const to = await User.findOne({ wallet: body.to }).populate<{ wallet: { status: WalletStatus } }>("wallet", "status -_id").lean<IUser & { wallet: { status: WalletStatus } }>()
    if (!to) {
        throw new AppError(httpStatus.NOT_FOUND, "Sender user not found")
    }
    if (to.role !== Role.AGENT) {
        throw new AppError(httpStatus.NOT_FOUND, "Send Money only Agent")
    }
    const data = await UserService.withdrawMoney(token.userId, body, to)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Withdraw Transaction created",
        data,
    })
})

const withdrawVerify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.user as JwtPayload
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User can not authorized")
    }
    const body = req.body
    const data = await UserService.withdrawVerify(token.userId, body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Withdraw Transaction completed",
        data,
    })
})

export const UserController = {
    getAllUsers,
    getSingleUsers,
    userBlockUnblock,
    userUpdateProfile,
    sendMoney,
    sendMoneyVerify,
    withdrawMoney,
    withdrawVerify
}