import { Router } from "express";
import checkAuth from "../../config/checkAuth";
import { Role } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";

const router = Router()

router.get("/", checkAuth(Role.ADMIN), TransactionController.getAllTransactions)
router.get("/me", checkAuth(...Object.values(Role)), TransactionController.getMeTransaction)

export const TransactionRoute = router