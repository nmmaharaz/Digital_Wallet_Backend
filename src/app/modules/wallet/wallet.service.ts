import { QueryBuilder } from "../../utils/QueryBuilder"
import { Wallet } from "./wallet.model"

const getAllWallet = async (query: Record<string, string>) => {
       const queryBuilder = new QueryBuilder(Wallet.find().populate("user", "phone name -_id"), query)
   
       const user = await queryBuilder
           .search([])
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

const getMeWallet = async (userId: string) => {
    const result = await Wallet.findOne({ user: userId })
    return result
}

export const WalletService = {
    getAllWallet,
    getMeWallet
}