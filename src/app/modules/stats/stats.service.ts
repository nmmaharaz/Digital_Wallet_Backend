import { TransactionStatus } from "../transaction/transaction.interface"
import { Transaction } from "../transaction/transaction.model"
import { IsActive } from "../user/user.interface"
import { User } from "../user/user.model"
import { Wallet } from "../wallet/wallet.model"

const now = new Date()
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7)
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30)

const getUserStats = async () => {
    const totalUserPromise = User.countDocuments();
    const totalActiveUserPromise = User.countDocuments({ isActive: IsActive.ACTIVE });
    const totalInActiveUserPromise = User.countDocuments({ isActive: IsActive.INACTIVE });
    const totalBlockedUserPromise = User.countDocuments({ isActive: IsActive.BLOCKED });

    const newUserInLast7DaysPromise = User.find({ createdAt: { $gte: sevenDaysAgo } }).populate("wallet", "balance -_id")
    const newUserInLast30DaysPromise = User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })

    const usersByRolePromise = User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ])

    const [totalUser, totalActiveUser, totalInActiveUser, totalBlockedUser, newUserInLast7Days, newUserInLast30Days, usersByRole] = await Promise.all([
        totalUserPromise,
        totalActiveUserPromise,
        totalInActiveUserPromise,
        totalBlockedUserPromise,
        newUserInLast7DaysPromise,
        newUserInLast30DaysPromise,
        usersByRolePromise
    ])
    return {
        totalUser,
        totalActiveUser,
        totalInActiveUser,
        totalBlockedUser,
        newUserInLast7Days,
        newUserInLast30Days,
        usersByRole
    }
}

const getUserWalletStats = async () => {
    const totalWalletPromise = await Wallet.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "wallet",
                as: "user"
            }
        },
        {
            $match: {
                "user.role": "USER"
            }
        },
        {
            $group: {
                _id: null,
                count: { $sum: 1 }
            }
        }
    ])
    const totalWalletBalancePromise = await Wallet.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "wallet",
                as: "user"
            }
        },
        {
            $match: { "user.role": "USER" } // filter only USER role
        },

        {
            $sort: { balance: -1 }
        },
        {
            $project: {
                _id: 1,
                balance: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,

                // User array er modhhe only name & role
                "user.name": 1,
                "user.role": 1
            }
        },
        {
            $limit: 10
        }
    ])
    const totalWalletRechivedPromise = await Wallet.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "wallet",
                as: "user"
            }
        },
        {
            $match: { "user.role": "USER" } // filter only USER role
        },

        {
            $sort: { totalReceived: -1 }
        },
        {
            $project: {
                _id: 1,
                totalReceived: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,

                // User array er modhhe only name & role
                "user.name": 1,
                "user.role": 1
            }
        },
        {
            $limit: 10
        }
    ])
    const totalWalletWithdrawPromise = await Wallet.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "wallet",
                as: "user"
            }
        },
        {
            $match: { "user.role": "USER" } // filter only USER role
        },

        {
            $sort: { totalWithdrawn: -1 }
        },
        {
            $project: {
                _id: 1,
                totalWithdrawn: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,

                // User array er modhhe only name & role
                "user.name": 1,
                "user.role": 1
            }
        },
        {
            $limit: 10
        }
    ])
    const totalWalletSentPromise = await Wallet.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "wallet",
                as: "user"
            }
        },
        {
            $match: { "user.role": "USER" } // filter only USER role
        },

        {
            $sort: { totalSent: -1 }
        },
        {
            $project: {
                _id: 1,
                totalSent: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,

                // User array er modhhe only name & role
                "user.name": 1,
                "user.role": 1
            }
        },
        {
            $limit: 10
        }
    ])

    const [totalWallet, totalWalletBalance, totalWalletRechived, totalWalletWithdraw, totalWalletSent] = await Promise.all([
        totalWalletPromise,
        totalWalletBalancePromise,
        totalWalletRechivedPromise,
        totalWalletWithdrawPromise,
        totalWalletSentPromise

    ])
    return {
        totalWallet, totalWalletBalance, totalWalletRechived, totalWalletWithdraw, totalWalletSent
    }
}

const getAgentWalletStats = async () => {
    const totalWalletPromise = await Wallet.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "wallet",
                as: "user"
            }
        },
        {
            $match: {
                "user.role": "AGENT",
            }
        },
        {
            $group: {
                _id: null,
                count: { $sum: 1 }
            }
        }
    ])
    const totalWalletBalancePromise = await Wallet.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "wallet",
                as: "user"
            }
        },
        {
            $match: { "user.role": "AGENT" } // filter only USER role
        },

        {
            $sort: { balance: -1 }
        },
        {
            $project: {
                _id: 1,
                balance: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,

                // User array er modhhe only name & role
                "user.name": 1,
                "user.role": 1
            }
        },
        {
            $limit: 10
        }
    ])
    const totalWalletRechivedPromise = await Wallet.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "wallet",
                as: "user"
            }
        },
        {
            $match: { "user.role": "AGENT" } // filter only USER role
        },

        {
            $sort: { totalReceived: -1 }
        },
        {
            $project: {
                _id: 1,
                totalReceived: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,

                // User array er modhhe only name & role
                "user.name": 1,
                "user.role": 1
            }
        },
        {
            $limit: 10
        }
    ])
    const totalWalletCashInPromise = await Wallet.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "wallet",
                as: "user"
            }
        },
        {
            $match: { "user.role": "AGENT" } // filter only USER role
        },

        {
            $sort: { totalCashIn: -1 }
        },
        {
            $project: {
                _id: 1,
                totalCashIn: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,

                // User array er modhhe only name & role
                "user.name": 1,
                "user.role": 1
            }
        },
        {
            $limit: 10
        }
    ])
    const totalWalletEarnPromise = await Wallet.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "wallet",
                as: "user"
            }
        },
        {
            $match: { "user.role": "AGENT" } // filter only USER role
        },

        {
            $sort: { totalCommissionEarned: -1 }
        },
        {
            $project: {
                _id: 1,
                totalCommissionEarned: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,

                // User array er modhhe only name & role
                "user.name": 1,
                "user.role": 1
            }
        },
        {
            $limit: 10
        }
    ])

    const [totalWallet, totalWalletBalance, totalWalletRechived, totalWalletCashIn, totalWalletEarn] = await Promise.all([
        totalWalletPromise,
        totalWalletBalancePromise,
        totalWalletRechivedPromise,
        totalWalletCashInPromise,
        totalWalletEarnPromise

    ])
    return {
        totalWallet, totalWalletBalance, totalWalletRechived, totalWalletCashIn, totalWalletEarn
    }
}

const getTransactionStats = async () => {
    const totalAddMoneyTransactionPromise = Transaction.countDocuments({ type: "add_money" })
    const totalwithdrawTransactionPromise = Transaction.countDocuments({ type: "withdraw" })
    const totalSendMoneyTransactionPromise = Transaction.countDocuments({ type: "send_money" })
    const totalCashInTransactionPromise = Transaction.countDocuments({ type: "cash_in" })

    const lastSavenDaysAddMoneyTransactionPromise = Transaction.find({ type: "add_money", createdAt: { $gte: sevenDaysAgo } }).populate("user", "name phone photo -_id")
    const lastSavenDayswithdrawTransactionPromise = Transaction.find({ type: "withdraw", createdAt: { $gte: sevenDaysAgo } }).populate("user", "name phone photo -_id")
    const lastSavenDaysSendMoneyTransactionPromise = Transaction.find({ type: "send_money", createdAt: { $gte: sevenDaysAgo } }).populate("user", "name phone photo -_id")
    const lastSavenDaysCashInTransactionPromise = Transaction.find({ type: "cash_in", createdAt: { $gte: sevenDaysAgo } }).populate("user", "name phone photo -_id")

    const last30DaysAddMoneyTransactionPromise = Transaction.find({ type: "add_money", createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")
    const last30DayswithdrawTransactionPromise = Transaction.find({ type: "withdraw", createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")
    const last30DaysSendMoneyTransactionPromise = Transaction.find({ type: "send_money", createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")
    const last30DaysCashInTransactionPromise = Transaction.find({ type: "cash_in", createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")


    const last30DaysAddMoneyCompletedTransactionPromise = Transaction.find({ type: "add_money", status: TransactionStatus.completed, createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")
    const last30DayswithdrawCompletedTransactionPromise = Transaction.find({ type: "withdraw", status: TransactionStatus.completed, createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")
    const last30DaysSendMoneyCompletedTransactionPromise = Transaction.find({ type: "send_money", status: TransactionStatus.completed, createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")
    const last30DaysCashInCompletedTransactionPromise = Transaction.find({ type: "cash_in", status: TransactionStatus.completed, createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")


    const last30DaysAddMoneyPendingTransactionPromise = Transaction.find({ type: "add_money", status: TransactionStatus.pending, createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")
    const last30DayswithdrawPendingTransactionPromise = Transaction.find({ type: "withdraw", status: TransactionStatus.pending, createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")
    const last30DaysSendMoneyPendingTransactionPromise = Transaction.find({ type: "send_money", status: TransactionStatus.pending, createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")
    const last30DaysCashInPendingTransactionPromise = Transaction.find({ type: "cash_in", status: TransactionStatus.pending, createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")

    const last30DaysAddMoneyCanceledTransactionPromise = Transaction.find({ type: "add_money", status: TransactionStatus.canceled, createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")
    const last30DayswithdrawCanceledTransactionPromise = Transaction.find({ type: "withdraw", status: TransactionStatus.canceled, createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")
    const last30DaysSendMoneyCanceledTransactionPromise = Transaction.find({ type: "send_money", status: TransactionStatus.canceled, createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")
    const last30DaysCashInCanceledTransactionPromise = Transaction.find({ type: "cash_in", status: TransactionStatus.canceled, createdAt: { $gte: thirtyDaysAgo } }).populate("user", "name phone photo -_id")



    const [totalAddMoneyTransaction,
        totalwithdrawTransaction,
        totalSendMoneyTransaction,
        totalCashInTransaction,
        lastSavenDayswithdrawTransaction,
        lastSavenDaysAddMoneyTransaction,
        lastSavenDaysSendMoneyTransaction,
        lastSavenDaysCashInTransaction,
        last30DaysAddMoneyTransaction,
        last30DayswithdrawTransaction,
        last30DaysSendMoneyTransaction,
        last30DaysCashInTransaction,
        last30DaysAddMoneyCompletedTransaction,
        last30DayswithdrawCompletedTransaction,
        last30DaysSendMoneyCompletedTransaction,
        last30DaysCashInCompletedTransaction,
        last30DaysAddMoneyPendingTransaction,
        last30DayswithdrawPendingTransaction,
        last30DaysSendMoneyPendingTransaction,
        last30DaysCashInPendingTransaction,
        last30DaysAddMoneyCanceledTransaction,
        last30DayswithdrawCanceledTransaction,
        last30DaysSendMoneyCanceledTransaction,
        last30DaysCashInCanceledTransaction] = 
        await Promise.all([
            totalAddMoneyTransactionPromise,
            totalwithdrawTransactionPromise,
            totalSendMoneyTransactionPromise,
            totalCashInTransactionPromise,
            lastSavenDayswithdrawTransactionPromise,
            lastSavenDaysAddMoneyTransactionPromise,
            lastSavenDaysSendMoneyTransactionPromise,
            lastSavenDaysCashInTransactionPromise,
            last30DaysAddMoneyTransactionPromise,
            last30DayswithdrawTransactionPromise,
            last30DaysSendMoneyTransactionPromise,
            last30DaysCashInTransactionPromise,
            last30DaysAddMoneyCompletedTransactionPromise,
            last30DayswithdrawCompletedTransactionPromise,
            last30DaysSendMoneyCompletedTransactionPromise,
            last30DaysCashInCompletedTransactionPromise,
            last30DaysAddMoneyPendingTransactionPromise,
            last30DayswithdrawPendingTransactionPromise,
            last30DaysSendMoneyPendingTransactionPromise,
            last30DaysCashInPendingTransactionPromise,
            last30DaysAddMoneyCanceledTransactionPromise,
            last30DayswithdrawCanceledTransactionPromise,
            last30DaysSendMoneyCanceledTransactionPromise,
            last30DaysCashInCanceledTransactionPromise
        ])
    return {
        totalAddMoneyTransaction,
        totalwithdrawTransaction,
        totalSendMoneyTransaction,
        totalCashInTransaction,
        lastSavenDayswithdrawTransaction,
        lastSavenDaysAddMoneyTransaction,
        lastSavenDaysSendMoneyTransaction,
        lastSavenDaysCashInTransaction,
        last30DaysAddMoneyTransaction,
        last30DayswithdrawTransaction,
        last30DaysSendMoneyTransaction,
        last30DaysCashInTransaction,
        last30DaysAddMoneyCompletedTransaction,
        last30DayswithdrawCompletedTransaction,
        last30DaysSendMoneyCompletedTransaction,
        last30DaysCashInCompletedTransaction,
        last30DaysAddMoneyPendingTransaction,
        last30DayswithdrawPendingTransaction,
        last30DaysSendMoneyPendingTransaction,
        last30DaysCashInPendingTransaction,
        last30DaysAddMoneyCanceledTransaction,
        last30DayswithdrawCanceledTransaction,
        last30DaysSendMoneyCanceledTransaction,
        last30DaysCashInCanceledTransaction
    }
}

export const statsService = {
    getUserStats,
    getUserWalletStats,
    getAgentWalletStats,
    getTransactionStats
}