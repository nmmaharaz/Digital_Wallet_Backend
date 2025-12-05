/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { TransactionService } from "./transaction.service";
import AppError from "../../errorHelpers/AppError";
import { JwtPayload } from "jsonwebtoken";

const getAllTransactions = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
     const user = await TransactionService.getAllTransactions(req.query as Record<string, string>)
   
       sendResponse(res, {
           success: true,
           statusCode: httpStatus.OK,
           message: "Otp Send Successfully",
           data: user.data,
           meta: user.meta
       })
})

// get logged in user transaction
const getMeTransaction = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const token = req.user as JwtPayload
    if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User can not authorized")
    }   
    const wallet = await TransactionService.getMeTransaction(token.userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Wallet fetched successfully",
        data: wallet
    })
})

const createTransaction = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const file = req.file
    // eslint-disable-next-line no-console
    console.log("file", file?.path)

    // const wallet = await TransactionService.getMeTransaction(token.userId)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "createTransaction fetched successfully",
        data: null
    })
})

export const TransactionController = {
    getAllTransactions,
    getMeTransaction,
    createTransaction
}