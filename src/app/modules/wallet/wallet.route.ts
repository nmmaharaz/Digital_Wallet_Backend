import { Router } from "express"
import checkAuth from "../../config/checkAuth"
import validationRequest from "../../middlewares/validationRequest"
import { Role } from "../user/user.interface"
import { userBlockUnblockZodSchema } from "../user/user.validation"
import { UserController } from "../user/user.controller"
import { WalletController } from "./wallet.controller"

const router = Router()

router.get("/", checkAuth(Role.ADMIN), WalletController.getAllWallets)
router.get("/me", checkAuth(...Object.values(Role)), WalletController.getMeWallet)
router.patch("/:id/block", checkAuth(Role.ADMIN), validationRequest(userBlockUnblockZodSchema), UserController.userBlockUnblock)


export const WalletRoute = router