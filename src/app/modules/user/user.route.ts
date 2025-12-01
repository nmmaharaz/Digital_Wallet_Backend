import { Router } from "express";
import checkAuth from "../../config/checkAuth";
import { Role } from "./user.interface";
import { UserController } from "./user.controller";
import validationRequest from "../../middlewares/validationRequest";
import { userBlockUnblockZodSchema, userUpdateProfileZodSchema } from "./user.validation";
// import { createTransactionZodShema } from "../transaction/transaction.validation";

const router = Router()

router.get("/", checkAuth(Role.ADMIN), UserController.getAllUsers)
router.get("/:id", checkAuth(Role.ADMIN), UserController.getSingleUsers)
router.patch("/:id/block", checkAuth(Role.ADMIN), validationRequest(userBlockUnblockZodSchema), UserController.userBlockUnblock)
router.patch("/update-profile", checkAuth(...Object.values(Role)), validationRequest(userUpdateProfileZodSchema), UserController.userUpdateProfile)

//Send Money 


export const UserRoute = router