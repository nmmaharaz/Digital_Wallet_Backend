/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import httpStatus from "http-status-codes"
import { statsService } from "./stats.service"

const getUserStats = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const result  = await statsService.getUserStats()
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User stats fetched successfully",
            data: result,
        })
})

const getUserWalletStats = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const result  = await statsService.getUserWalletStats()
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User stats fetched successfully",
            data: result,
        })
})
const getAgentWalletStats = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const result  = await statsService.getAgentWalletStats()
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Agent stats fetched successfully",
            data: result,
        })
})
const getTransactionStats = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const result  = await statsService.getTransactionStats()
      sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Transaction stats fetched successfully",
            data: result,
        })
})


export const StatsController = {
    getUserStats,
    getUserWalletStats,
    getAgentWalletStats,
    getTransactionStats
}