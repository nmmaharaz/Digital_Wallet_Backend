import { Router } from "express";
import AuthRoute from "../modules/auth/auth.route";

export const router = Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoute
    }
]

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})