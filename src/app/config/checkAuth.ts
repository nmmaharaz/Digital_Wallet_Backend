import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { envVars } from "./env"
import AppError from "../errorHelpers/AppError"
import httpStatus from "http-status-codes"
import { User } from "../modules/user/user.model"
import { IsActive, IsVerified } from "../modules/user/user.interface"


const checkAuth = (...role: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies.accessToken
        if (!accessToken) {
            throw new AppError(httpStatus.UNAUTHORIZED, "No accessToken provided")
        }
        const auth = jwt.verify(accessToken, envVars.JWT.JWT_ACCESS_SECRET) as JwtPayload
        const isAuthExist = await User.findOne({ phone: auth.phone });
        if (!isAuthExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "Email does not exist")
        }
        if (isAuthExist.isActive === IsActive.BLOCKED || isAuthExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isAuthExist.isActive}`);
        }

        if (isAuthExist.isVerified !== IsVerified.VERIFIED) {
            throw new AppError(httpStatus.BAD_REQUEST, `User can not varified`);
        }
        req.user = auth
        if (!role.includes(auth.role)) {
            throw new AppError(403, "You are not authorized to access this route")
        }

        next()
    } catch (err) {
        next(err)
    }
}

export default checkAuth 