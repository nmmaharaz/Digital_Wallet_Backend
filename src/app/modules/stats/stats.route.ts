import { Router } from "express";
import checkAuth from "../../config/checkAuth";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";

const router = Router();

router.get("/user", checkAuth(Role.ADMIN), StatsController.getUserStats)
router.get("/user/wallet", checkAuth(Role.ADMIN), StatsController.getUserWalletStats)
router.get("/agent/wallet", checkAuth(Role.ADMIN), StatsController.getAgentWalletStats)
router.get("/transaction", checkAuth(Role.ADMIN), StatsController.getTransactionStats)


export const StatsRoute = router;