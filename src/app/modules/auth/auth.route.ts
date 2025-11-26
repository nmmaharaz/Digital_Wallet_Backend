import { Router } from "express";
import { AuthController } from "./auth.controller";
import validationRequest from "../../middlewares/validationRequest";
import { authLoginZodSchema, registerAuthZodSchema, VerifyOTPZodSchema} from "./auth.validation";

const router = Router()

router.post("/register",validationRequest(registerAuthZodSchema), AuthController.authRegister)
router.post("/verify",validationRequest(VerifyOTPZodSchema), AuthController.authVerify)
router.post("/login",validationRequest(authLoginZodSchema), AuthController.authLogin)
router.post("/login/verify",validationRequest(VerifyOTPZodSchema), AuthController.authLoginVerify)

const AuthRoute = router

export default AuthRoute