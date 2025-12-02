import { QueryBuilder } from "../../utils/QueryBuilder"
import { Transaction } from "./transaction.model"

const getAllTransactions = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(Transaction.find(), query)

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

const getMeTransaction = async (userId: string) => {
    const result = await Transaction.findOne({ user: userId })
    return result
}


export const TransactionService = {
    getAllTransactions,
    getMeTransaction
}