import { userSecarchableFields } from "../../../contant"
import sendEmail from "../../config/nodeMailer"
import AppError from "../../errorHelpers/AppError"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { IWallet } from "../wallet/wallet.interface"
import { Wallet } from "../wallet/wallet.model"
import { IUser, IuserBlockUnblock, Role } from "./user.interface"
import { User } from "./user.model"
import httpStatus from "http-status-codes"

const getAllUsers = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find().populate("wallet", "balance -_id"), query)

    const user = await queryBuilder
        .search(userSecarchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        user.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const getSingleUsers = async (id: string) => {
    const data = await User.findById(id)
    return data
}

const userBlockUnblock = async (id: string, body: IuserBlockUnblock) => {
    let finalStatus: string | null = ""
    let email: string | null = ""

    if (body.isActive !== undefined) {
        const auth = await User.findByIdAndUpdate(id, { isActive: body.isActive }, { new: true })
        if (!auth) {
            throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong");
        }
        email = auth?.email
        finalStatus = body.isActive
    }
    if (body.approvalStatus !== undefined) {
        const auth = await User.findByIdAndUpdate(id, { approvalStatus: body.approvalStatus }, { new: true })
        if (!auth || auth.role !== Role.AGENT) {
            throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong");
        }
        email = auth?.email
        finalStatus = body.approvalStatus
    }
    if (body.status !== undefined) {
        console.log("mama aschila")
        const wallet = await Wallet.findByIdAndUpdate(id, { status: body.status }, { new: true, runValidators: true }).populate<{ user: { email: string } }>("user", "email -_id")
        if (!wallet) {
            throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong");
        }
        email = wallet.user.email
        finalStatus = body.status
    }




    sendEmail({
        to: email,
        subject: "User varification",
        templateName: "blockUnblock",
        templateData: {
            name: "Nadimul Mawla Meheraj",
            status: finalStatus,
            reason: "Policy violation",
            link: "https://your-app.com/appeal"
        }
    })
}




const userUpdateProfile = async (id: string, body: Partial<IUser>) => {
    const data = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true })

    return data
}

export const UserService = {
    getAllUsers,
    getSingleUsers,
    userBlockUnblock,
    userUpdateProfile
}