import { Router } from "express";
import checkAuth from "../../config/checkAuth";
import { Role } from "../user/user.interface";
import validationRequest from "../../middlewares/validationRequest";
import { createTransactionZodShema, tranferVerifyZodSchema } from "../transaction/transaction.validation";
import { AgentController } from "./agent.controller";

const router = Router()

router.post("/cash-in", checkAuth(Role.AGENT), validationRequest(createTransactionZodShema), AgentController.cashIn)

router.post("/cash-in/verify", checkAuth(Role.AGENT), validationRequest(tranferVerifyZodSchema), AgentController.cashInVerify)

export const AgentRouter = router