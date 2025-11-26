import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken"

const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
   const token = jwt.sign(payload, secret, {
       expiresIn
    } as SignOptions)
   return token
}
export default generateToken