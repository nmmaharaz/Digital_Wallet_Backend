import { Router } from "express";
import AuthRoute from "../modules/auth/auth.route";
import { OtpRoute } from "../modules/otp/otp.route";
import { UserRoute } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoute
    },
    {
        path: "/otp",
        route: OtpRoute
    },
    {
        path: "/user",
        route: UserRoute
    }
]

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})