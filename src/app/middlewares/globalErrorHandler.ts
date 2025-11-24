/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";


const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR
    let message = `Something want wrong!! ${err.message} from global error`
    const stack = envVars.NODE_DEV === "development" ? err.stack : null

    if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }

    if (err instanceof Error) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR
        message = err.message
    }



    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack
    })
}


export default globalErrorHandler