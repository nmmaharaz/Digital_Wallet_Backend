import dotenv from "dotenv"
dotenv.config()

interface IEnvVars {
    PORT: string,
    DB_URL: string,
    NODE_DEV: "development" | "production"
}  


const loadEnvVariables =(): IEnvVars=>{
    const requiredEnvVariables = ["PORT", "DB_URL", "NODE_DEV"]

    requiredEnvVariables.forEach((key)=>{
        if(!process.env[key]){
            throw new Error(`Environment Variable ${key} is not set`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_DEV: process.env.NODE_DEV as "development" | "production"
    }
}


export const envVars = loadEnvVariables()
