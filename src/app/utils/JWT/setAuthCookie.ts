import { Response } from "express";

interface ITokenInfo {
    accessToken?: string,
    refreshToken?: string
}

const setAuthCookie = async (res: Response, tokenInfo: ITokenInfo) => {
    if(tokenInfo.accessToken){
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite:"none"
        })
    }

    if(tokenInfo.refreshToken){
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite:"none"
        })
    }
}

export default setAuthCookie