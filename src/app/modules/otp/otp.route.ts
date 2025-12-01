import { Router } from "express";
import validationRequest from "../../middlewares/validationRequest";
import { sendOtpZodSchema } from "./otp.validation";
import { OptController } from "./otp.controller";

const router = Router()

router.post("/send", validationRequest(sendOtpZodSchema), OptController.sendOtp)

export const OtpRoute = router