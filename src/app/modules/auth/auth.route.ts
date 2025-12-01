import { Router } from "express";
import { AuthController } from "./auth.controller";
import validationRequest from "../../middlewares/validationRequest";
import { authLoginZodSchema, changePinZodSchema, registerAuthZodSchema, VerifyOTPZodSchema } from "./auth.validation";
import checkAuth from "../../config/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.post("/register", validationRequest(registerAuthZodSchema), AuthController.authRegister)
router.post("/verify", validationRequest(VerifyOTPZodSchema), AuthController.authVerify)
router.post("/login", validationRequest(authLoginZodSchema), AuthController.authLogin)
router.post("/login/verify", validationRequest(VerifyOTPZodSchema), AuthController.authLoginVerify)
router.post("/logout", checkAuth(...Object.values(Role)), AuthController.authLogout)
router.get("/me", checkAuth(...Object.values(Role)), AuthController.authMe)
router.post("/change-pin", checkAuth(...Object.values(Role)), validationRequest(changePinZodSchema), AuthController.changePin)
router.post("/forgot-pin", AuthController.forgotPin)

const AuthRoute = router
export default AuthRoute;