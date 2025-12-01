import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { OtpServices } from "./otp.service";

const sendOtp = catchAsync(async(req: Request, res: Response)=>{
      const {phone} = req.body;
    await OtpServices.sendOtp(phone);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Otp Send Successfully",
        data: null,
    })
})

export const OptController = {
    sendOtp
}