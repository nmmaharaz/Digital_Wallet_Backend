import { Router } from "express";
import checkAuth from "../../config/checkAuth";
import { Role } from "./user.interface";
import { UserController } from "./user.controller";
import validationRequest from "../../middlewares/validationRequest";
import { userBlockUnblockZodSchema, userUpdateProfileZodSchema } from "./user.validation";
import { createTransactionZodShema, tranferVerifyZodSchema } from "../transaction/transaction.validation";

const router = Router()

router.get("/", checkAuth(Role.ADMIN), UserController.getAllUsers)
router.get("/:id", checkAuth(Role.ADMIN), UserController.getSingleUsers)
router.patch("/:id/block", checkAuth(Role.ADMIN), validationRequest(userBlockUnblockZodSchema), UserController.userBlockUnblock)
router.patch("/update-profile", checkAuth(...Object.values(Role)), validationRequest(userUpdateProfileZodSchema), UserController.userUpdateProfile)

//Send Money 
router.post("/send-money", checkAuth(Role.USER), validationRequest(createTransactionZodShema), UserController.sendMoney)
router.post("/send-money/verify", checkAuth(Role.USER), validationRequest(tranferVerifyZodSchema), UserController.sendMoneyVerify)

//whithdraw Money
router.post("/withdraw", checkAuth(Role.USER), validationRequest(createTransactionZodShema), UserController.withdrawMoney)
router.post("/withdraw/verify", checkAuth(Role.USER), validationRequest(tranferVerifyZodSchema), UserController.withdrawVerify)

export const UserRoute = router