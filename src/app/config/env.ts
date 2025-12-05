import dotenv from "dotenv"
import { PermissionLevel } from "../modules/user/user.interface"
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
    },
    FRONTEND_URL: string,
    SUPER_ADMIN: {
        SUPER_ADMIN_PHONE: string,
        SUPER_ADMIN_EMAIL: string,
        SUPER_ADMIN_PIN: string,
        SUPER_ADMIN_DATEOFBIRTH: string
        SUPER_ADMIN_ADDRESS: string
        SUPER_ADMIN_NIDNUMBER: string,
        SUPER_ADMIN_PERMISSIONLEVEL: PermissionLevel.SUPER
    },
    ADMIN: {
        ADMIN_PHONE: string,
        ADMIN_EMAIL: string,
        ADMIN_PIN: string,
        ADMIN_DATEOFBIRTH: string
        ADMIN_ADDRESS: string
        ADMIN_NIDNUMBER: string,
        ADMIN_PERMISSIONLEVEL: PermissionLevel.ADMIN
    },
    ADMIN_MANAGER: {
        ADMIN_MANAGER_PHONE: string,
        ADMIN_MANAGER_EMAIL: string,
        ADMIN_MANAGER_PIN: string,
        ADMIN_MANAGER_DATEOFBIRTH: string
        ADMIN_MANAGER_ADDRESS: string
        ADMIN_MANAGER_NIDNUMBER: string,
        ADMIN_MANAGER_PERMISSIONLEVEL: PermissionLevel.MANAGER
    },
    ADMIN_SUPPORT: {
        ADMIN_SUPPORT_PHONE: string,
        ADMIN_SUPPORT_EMAIL: string,
        ADMIN_SUPPORT_PIN: string,
        ADMIN_SUPPORT_DATEOFBIRTH: string
        ADMIN_SUPPORT_ADDRESS: string
        ADMIN_SUPPORT_NIDNUMBER: string,
        ADMIN_SUPPORT_PERMISSIONLEVEL: PermissionLevel.SUPPORT
    },
    SSL: {
        SSL_STORE_ID: string,
        SSL_STORE_PASS: string,
        SSL_PAYMENT_API: string,
        SSL_VALIDATION_API: string,
        SSL_IPM_URL: string,
        SSL_SUCCESS_BACKEND_URL: string,
        SSL_FAIL_BACKEND_URL: string,
        SSL_CANCEL_BACKEND_URL: string,
        SSL_SUCCESS_FRONTEND_URL: string,
        SSL_FAIL_FRONTEND_URL: string,
        SSL_CANCEL_FRONTEND_URL: string
    },
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string,
        CLOUDINARY_API_KEY: string,
        CLOUDINARY_API_SECRET: string
    }
}


const loadEnvVariables = (): IEnvVars => {
    const requiredEnvVariables = ["PORT", "DB_URL", "NODE_DEV", "BCRYPT_SALT_ROUND", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "REDIS_HOST", "REDIS_PORT", "REDIS_USERNAME", "REDIS_PASSWORD", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", "FRONTEND_URL", "SUPER_ADMIN_PHONE", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PIN", "SUPER_ADMIN_DATEOFBIRTH", "SUPER_ADMIN_ADDRESS", "SUPER_ADMIN_NIDNUMBER", "SUPER_ADMIN_PERMISSIONLEVEL", "ADMIN_PHONE", "ADMIN_EMAIL", "ADMIN_PIN", "ADMIN_DATEOFBIRTH", "ADMIN_ADDRESS", "ADMIN_NIDNUMBER", "ADMIN_PERMISSIONLEVEL", "ADMIN_MANAGER_PHONE", "ADMIN_MANAGER_EMAIL", "ADMIN_MANAGER_PIN", "ADMIN_MANAGER_DATEOFBIRTH", "ADMIN_MANAGER_ADDRESS", "ADMIN_MANAGER_NIDNUMBER", "ADMIN_MANAGER_PERMISSIONLEVEL", "ADMIN_SUPPORT_PHONE", "ADMIN_SUPPORT_EMAIL", "ADMIN_SUPPORT_PIN", "ADMIN_SUPPORT_DATEOFBIRTH", "ADMIN_SUPPORT_ADDRESS", "ADMIN_SUPPORT_NIDNUMBER", "ADMIN_SUPPORT_PERMISSIONLEVEL", "SSL_STORE_ID", "SSL_STORE_PASS", "SSL_PAYMENT_API", "SSL_VALIDATION_API", "SSL_IPM_URL", "SSL_SUCCESS_BACKEND_URL", "SSL_FAIL_BACKEND_URL", "SSL_CANCEL_BACKEND_URL", "SSL_SUCCESS_FRONTEND_URL", "SSL_FAIL_FRONTEND_URL", "SSL_CANCEL_FRONTEND_URL", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]

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
        },
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        SUPER_ADMIN: {
            SUPER_ADMIN_PHONE: process.env.SUPER_ADMIN_PHONE as string,
            SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
            SUPER_ADMIN_PIN: process.env.SUPER_ADMIN_PIN as string,
            SUPER_ADMIN_DATEOFBIRTH: process.env.SUPER_ADMIN_DATEOFBIRTH as string,
            SUPER_ADMIN_ADDRESS: process.env.SUPER_ADMIN_ADDRESS as string,
            SUPER_ADMIN_NIDNUMBER: process.env.SUPER_ADMIN_NIDNUMBER as string,
            SUPER_ADMIN_PERMISSIONLEVEL: process.env.SUPER_ADMIN_PERMISSIONLEVEL as PermissionLevel.SUPER
        },
        ADMIN: {
            ADMIN_PHONE: process.env.ADMIN_PHONE as string,
            ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
            ADMIN_PIN: process.env.ADMIN_PIN as string,
            ADMIN_DATEOFBIRTH: process.env.ADMIN_DATEOFBIRTH as string,
            ADMIN_ADDRESS: process.env.ADMIN_ADDRESS as string,
            ADMIN_NIDNUMBER: process.env.ADMIN_NIDNUMBER as string,
            ADMIN_PERMISSIONLEVEL: process.env.ADMIN_PERMISSIONLEVEL as PermissionLevel.ADMIN
        },
        ADMIN_MANAGER: {
            ADMIN_MANAGER_PHONE: process.env.ADMIN_MANAGER_PHONE as string,
            ADMIN_MANAGER_EMAIL: process.env.ADMIN_MANAGER_EMAIL as string,
            ADMIN_MANAGER_PIN: process.env.ADMIN_MANAGER_PIN as string,
            ADMIN_MANAGER_DATEOFBIRTH: process.env.ADMIN_MANAGER_DATEOFBIRTH as string,
            ADMIN_MANAGER_ADDRESS: process.env.ADMIN_MANAGER_ADDRESS as string,
            ADMIN_MANAGER_NIDNUMBER: process.env.ADMIN_MANAGER_NIDNUMBER as string,
            ADMIN_MANAGER_PERMISSIONLEVEL: process.env.ADMIN_MANAGER_PERMISSIONLEVEL as PermissionLevel.MANAGER
        },
        ADMIN_SUPPORT: {
            ADMIN_SUPPORT_PHONE: process.env.ADMIN_SUPPORT_PHONE as string,
            ADMIN_SUPPORT_EMAIL: process.env.ADMIN_SUPPORT_EMAIL as string,
            ADMIN_SUPPORT_PIN: process.env.ADMIN_SUPPORT_PIN as string,
            ADMIN_SUPPORT_DATEOFBIRTH: process.env.ADMIN_SUPPORT_DATEOFBIRTH as string,
            ADMIN_SUPPORT_ADDRESS: process.env.ADMIN_SUPPORT_ADDRESS as string,
            ADMIN_SUPPORT_NIDNUMBER: process.env.ADMIN_SUPPORT_NIDNUMBER as string,
            ADMIN_SUPPORT_PERMISSIONLEVEL: process.env.ADMIN_SUPPORT_PERMISSIONLEVEL as PermissionLevel.SUPPORT
        },
        SSL: {
            SSL_STORE_ID: process.env.SSL_STORE_ID as string,
            SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
            SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
            SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,
            SSL_IPM_URL: process.env.SSL_IPM_URL as string,
            SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
            SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
            SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,
            SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
            SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
            SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string
        },
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string
        },
    }
}


export const envVars = loadEnvVariables()
