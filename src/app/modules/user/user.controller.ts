/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { UserService } from "./user.service";
import AppError from "../../errorHelpers/AppError";
import { User } from "./user.model";
import { JwtPayload } from "jsonwebtoken";
import { PermissionLevel, Role } from "./user.interface";

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.getAllUsers(req.query as Record<string, string>)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Otp Send Successfully",
        data: user,
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


export const UserController = {
    getAllUsers,
    getSingleUsers,
    userBlockUnblock,
    userUpdateProfile,
}