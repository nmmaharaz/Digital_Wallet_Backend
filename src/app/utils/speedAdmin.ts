import { envVars } from "../config/env"
import { IsActive, IsVerified, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model"
import bcript from "bcrypt"
export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ phone: envVars.SUPER_ADMIN.SUPER_ADMIN_PHONE });
        if (isSuperAdminExist) {
            return console.log("Super Admin already exists");
        }

        const hashPassword = await bcript.hash(envVars.SUPER_ADMIN.SUPER_ADMIN_PIN, Number(envVars.BCRYPT_SALT_ROUND))

        const payload: IUser = {
            name: "Super Admin",
            phone: envVars.SUPER_ADMIN.SUPER_ADMIN_PHONE,
            email: envVars.SUPER_ADMIN.SUPER_ADMIN_EMAIL,
            pin: hashPassword,
            role: Role.ADMIN,
            dateOfBirth: new Date(envVars.SUPER_ADMIN.SUPER_ADMIN_DATEOFBIRTH),
            address: envVars.SUPER_ADMIN.SUPER_ADMIN_ADDRESS,
            nidNumber: envVars.SUPER_ADMIN.SUPER_ADMIN_NIDNUMBER,
            permissionLevel: envVars.SUPER_ADMIN.SUPER_ADMIN_PERMISSIONLEVEL,
            isActive: IsActive.ACTIVE,
            isVerified: IsVerified.UNVERIFIED
        }

        await User.create(payload)
        console.log("Super Admin created successfully");
    } catch (err) {
        console.log(err)
    }
}
export const seedAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ phone: envVars.ADMIN.ADMIN_PHONE });
        if (isSuperAdminExist) {
            return console.log("Admin already exists");
        }

        const hashPassword = await bcript.hash(envVars.ADMIN.ADMIN_PIN, Number(envVars.BCRYPT_SALT_ROUND))

        const payload: IUser = {
            name: "Admin",
            phone: envVars.ADMIN.ADMIN_PHONE,
            email: envVars.ADMIN.ADMIN_EMAIL,
            pin: hashPassword,
            role: Role.ADMIN,
            dateOfBirth: new Date(envVars.ADMIN.ADMIN_DATEOFBIRTH),
            address: envVars.ADMIN.ADMIN_ADDRESS,
            nidNumber: envVars.ADMIN.ADMIN_NIDNUMBER,
            permissionLevel: envVars.ADMIN.ADMIN_PERMISSIONLEVEL,
            isActive: IsActive.ACTIVE,
            isVerified: IsVerified.UNVERIFIED
        }

        await User.create(payload)
        console.log("Admin created successfully");
    } catch (err) {
        console.log(err)
    }
}
export const seedAdminManager = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ phone: envVars.ADMIN_MANAGER.ADMIN_MANAGER_PHONE });
        if (isSuperAdminExist) {
            return console.log("Admin Manager already exists");
        }

        const hashPassword = await bcript.hash(envVars.ADMIN_MANAGER.ADMIN_MANAGER_PIN, Number(envVars.BCRYPT_SALT_ROUND))

        const payload: IUser = {
            name: "Admin Manager",
            phone: envVars.ADMIN_MANAGER.ADMIN_MANAGER_PHONE,
            email: envVars.ADMIN_MANAGER.ADMIN_MANAGER_EMAIL,
            pin: hashPassword,
            role: Role.ADMIN,
            dateOfBirth: new Date(envVars.ADMIN_MANAGER.ADMIN_MANAGER_DATEOFBIRTH),
            address: envVars.ADMIN_MANAGER.ADMIN_MANAGER_ADDRESS,
            nidNumber: envVars.ADMIN_MANAGER.ADMIN_MANAGER_NIDNUMBER,
            permissionLevel: envVars.ADMIN_MANAGER.ADMIN_MANAGER_PERMISSIONLEVEL,
            isActive: IsActive.ACTIVE,
            isVerified: IsVerified.UNVERIFIED
        }

        await User.create(payload)
        console.log("Admin Manager created successfully");
    } catch (err) {
        console.log(err)
    }
}
export const seedAdminSupport = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ phone: envVars.ADMIN_SUPPORT.ADMIN_SUPPORT_PHONE });
        if (isSuperAdminExist) {
            return console.log("Admin support already exists");
        }

        const hashPassword = await bcript.hash(envVars.ADMIN_SUPPORT.ADMIN_SUPPORT_PIN, Number(envVars.BCRYPT_SALT_ROUND))

        const payload: IUser = {
            name: "Admin support",
            phone: envVars.ADMIN_SUPPORT.ADMIN_SUPPORT_PHONE,
            email: envVars.ADMIN_SUPPORT.ADMIN_SUPPORT_EMAIL,
            pin: hashPassword,
            role: Role.ADMIN,
            dateOfBirth: new Date(envVars.ADMIN_SUPPORT.ADMIN_SUPPORT_DATEOFBIRTH),
            address: envVars.ADMIN_SUPPORT.ADMIN_SUPPORT_ADDRESS,
            nidNumber: envVars.ADMIN_SUPPORT.ADMIN_SUPPORT_NIDNUMBER,
            permissionLevel: envVars.ADMIN_SUPPORT.ADMIN_SUPPORT_PERMISSIONLEVEL,
            isActive: IsActive.ACTIVE,
            isVerified: IsVerified.UNVERIFIED
        }

        await User.create(payload)
        console.log("Admin support created successfully");
    } catch (err) {
        console.log(err)
    }
}