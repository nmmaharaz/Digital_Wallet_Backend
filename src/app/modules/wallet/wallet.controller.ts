/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken";
import { WalletService } from "./wallet.service";

const getAllWallets = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const user = await WalletService.getAllWallet(req.query as Record<string, string>)
   
       sendResponse(res, {
           success: true,
           statusCode: httpStatus.OK,
           message: "Otp Send Successfully",
           data: user.data,
           meta: user.meta
       })
})

const getMeWallet = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const token = req.user as JwtPayload
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User can not authorized")
    }   
    const wallet = await WalletService.getMeWallet(token.userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Wallet fetched successfully",
        data: wallet,
    })
})




export const WalletController = {
    getMeWallet,
    getAllWallets
}