import { Response } from "express";
import { envVars } from "../../config/env";
import { IUser } from "../../modules/user/user.interface"
import generateToken from "./generateToken";
import setAuthCookie from "./setAuthCookie";

const createAuthToken = (res: Response, auth: IUser) => {
    const jwtPaylod = {
        userId: auth._id,
        phone: auth.phone,
        role: auth.role
    }
    const accessToken = generateToken(jwtPaylod, envVars.JWT.JWT_ACCESS_SECRET, envVars.JWT.JWT_ACCESS_EXPIRES)
    const refreshToken = generateToken(jwtPaylod, envVars.JWT.JWT_REFRESH_SECRET, envVars.JWT.JWT_REFRESH_EXPIRES)
    setAuthCookie(res, { accessToken, refreshToken })
    return { accessToken, refreshToken }
}

export default createAuthToken;