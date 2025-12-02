/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken"
import AppError from "../../errorHelpers/AppError"
import { User } from "../user/user.model"
import { WalletStatus } from "../wallet/wallet.interface"
import { IUser, Role } from "../user/user.interface"
import { AgentService } from "./agent.service"

const cashIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.user as JwtPayload
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User can not authorized")
    }
    const body = req.body
    const to = await User.findOne({ wallet: body.to }).populate<{ wallet: { status: WalletStatus } }>("wallet", "status -_id").lean<IUser & { wallet: { status: WalletStatus } }>()
    if (!to) {
        throw new AppError(httpStatus.NOT_FOUND, "Sender user not found")
    }
    if (to.role === Role.ADMIN) {
        throw new AppError(httpStatus.NOT_FOUND, "Send Money only User and Agent")
    }
    const data = await AgentService.cashIn(token.userId, body, to)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Send Money Transaction created",
        data,
    })
})

const cashInVerify = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.user as JwtPayload
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User can not authorized")
    }
    const body = req.body
    const data = await AgentService.cashInVerify(token.userId, body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Send Money Transaction created",
        data,
    })
})

export const AgentController = {
    cashIn,
    cashInVerify
}