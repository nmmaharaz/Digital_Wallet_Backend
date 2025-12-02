import { Router } from "express";
import AuthRoute from "../modules/auth/auth.route";
import { OtpRoute } from "../modules/otp/otp.route";
import { UserRoute } from "../modules/user/user.route";
import { AgentRouter } from "../modules/agent/agent.route";
import { WalletRoute } from "../modules/wallet/wallet.route";
import { TransactionRoute } from "../modules/transaction/transaction.route";

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
    },
    {
        path: "/agent",
        route: AgentRouter
    },
    {
        path: "/wallet",
        route: WalletRoute
    },
    {
        path: "/transaction",
        route: TransactionRoute
    }
]

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})