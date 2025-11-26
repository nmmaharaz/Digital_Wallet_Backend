import dotenv from "dotenv"
dotenv.config()

interface IEnvVars {
    PORT: string,
    DB_URL: string,
    NODE_DEV: "development" | "production",
    BCRYPT_SALT_ROUND: string,
    SMS: {
        TWILIO_ACCOUNT_SID: string,
        TWILIO_AUTH_TOKEN: string
    },
    EMAIL_SENDER: {
        SMTP_HOST: string,
        SMTP_PORT: string,
        SMTP_USER: string,
        SMTP_PASS: string,
        SMTP_FROM: string
    },
    REDIS: {
        REDIS_HOST: string,
        REDIS_PORT: string,
        REDIS_USERNAME: string,
        REDIS_PASSWORD: string
    },
    JWT: {
        JWT_ACCESS_SECRET: string,
        JWT_ACCESS_EXPIRES: string,
        JWT_REFRESH_SECRET: string,
        JWT_REFRESH_EXPIRES: string
    }
}


const loadEnvVariables = (): IEnvVars => {
    const requiredEnvVariables = ["PORT", "DB_URL", "NODE_DEV", "BCRYPT_SALT_ROUND", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "REDIS_HOST", "REDIS_PORT", "REDIS_USERNAME", "REDIS_PASSWORD", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES"]

    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Environment Variable ${key} is not set`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_DEV: process.env.NODE_DEV as "development" | "production",
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        SMS: {
            TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID as string,
            TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN as string
        },
        EMAIL_SENDER: {
            SMTP_HOST: process.env.SMTP_HOST as string,
            SMTP_PORT: process.env.SMTP_PORT as string,
            SMTP_USER: process.env.SMTP_USER as string,
            SMTP_PASS: process.env.SMTP_PASS as string,
            SMTP_FROM: process.env.SMTP_FROM as string
        },
        REDIS: {
            REDIS_HOST: process.env.REDIS_HOST as string,
            REDIS_PORT: process.env.REDIS_PORT as string,
            REDIS_USERNAME: process.env.REDIS_USERNAME as string,
            REDIS_PASSWORD: process.env.REDIS_PASSWORD as string
        },
        JWT: {
            JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
            JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
            JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string
        }
    }
}


export const envVars = loadEnvVariables()
