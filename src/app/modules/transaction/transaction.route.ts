import { Router } from "express";
import checkAuth from "../../config/checkAuth";
import { Role } from "../user/user.interface";
import { TransactionController } from "./transaction.controller";
import { multerUpload } from "../../config/multer.config";

const router = Router()

router.get("/", checkAuth(Role.ADMIN), TransactionController.getAllTransactions)
router.get("/me", checkAuth(...Object.values(Role)), TransactionController.getMeTransaction)
router.post("/", multerUpload.single("file"), TransactionController.createTransaction)

export const TransactionRoute = router