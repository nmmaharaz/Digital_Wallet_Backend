import express, { Request, Response } from "express"
import cors from "cors"
import globalErrorHandler from "./app/middlewares/globalErrorHandler"
import { notFound } from "./app/middlewares/notFound"

const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req: Request, res: Response)=>{
    res.send("Welcome To My Digital Wallet Service")
})

app.use(globalErrorHandler)
app.use(notFound)

export default app