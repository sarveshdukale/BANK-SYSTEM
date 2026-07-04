const trasnsactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const { default: mongoose } = require("mongoose");
const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");



async function createTransaction(req,res) {
    
    /**
     * -1. Validate request
     */

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "fromAccount , toAccount , amount and idempotencyKey are required",
        })
    }

    const fromUserAcount = await userModel.findOne({
        _id: fromAccount,
    })

    const toUserAccount = await userModel.findOne({
        _id : toAccount,
    })

    if (!fromUserAcount || !toUserAccount) {
        return res.status(400).json({
            message :"Invalid fromAccount or toAccount"
        })
    }

    /**
     * -2. Validate idempotencyKey
     */

    const isTransactionAllreadyExists = await transactionMedel.findOne({
        idempotencyKey : idempotencyKey,
    })

    if (isTransactionAllreadyExists) {
        if (isTransactionAllreadyExists.status = "CPMPLETED") {
            return res.status(200).json({
                message: "Transaaction Allready processed",
                trasnsaction: isTransactionAllreadyExists,
            })
        }

        if ((isTransactionAllreadyExists.status = "PENDING")) {
          return res.status(200).json({
            message: "Transaaction is still processing",
          });
        }

        if ((isTransactionAllreadyExists.status = "FAILED")) {
          return res.status(500).json({
            message: "Transaaction processing failed , please retry",
          });
        }

        if ((isTransactionAllreadyExists.status = "REVERSED")) {
          return res.status(500).json({
            message: "Transaaction was reversed , please retry",
          });
        }
    }


    /**
     * -3. Check account status
     */

    if (fromUserAcount.status !== "ACTIVE" && toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Bothe fromAccount and toAccount Must be in Active state for trasnsaction",
        })
    }

    /**
     * -4. Derive senders balance from ledger
     */

    const balance = await fromUserAcount.getbalance();

    if (balance < amout) {
        return res.status(400).json({
            message: `Insufficient Balance. Current Balance is ${balance}. requested amount is ${amount} .`
        })
    }

    let trasnsaction;

    try {
        /**
         * -5. Create transaction (PENDING);
         */

        const session = await mongoose.startSession();
        session.startTransaction();

        trasnsaction = (await trasnsactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
        }], { session }))[0]
    
        const debitLedgerEntry = await ledgerModel.create([{
            account: fromAccount,
            amount: amount,
            trasnsaction: trasnsaction._id,
            type: "DEBIT",
        }], { session })
    
        await (() => {
            return new Promise((resolve) => setTimeout(resolve, 100 * 1000))
        })();

        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            trasnsaction: trasnsaction._id,
            type: "CREDIT"
        }], { session })
    
        await trasnsactionModel.findOneAndUpdate(
            { id: trasnsaction._id },
            { status: "COMPLETED" },
            { session },
        )
    
        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        return res.status(400).json({
            message: "Transaction is pending due to some issues,please retry after somw time."
        })
    }
    return res.status(200).json({
        message: "Transaction completed successfuly",
        trasnsaction : trasnsaction
    })
    
}

async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(403).json({
            message:"toAccount , amount and idempotencyKey are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message:"toAccount not exists"
        })
    }

    const fromUserAcount = await accountModel.findOne({
        systemUser: true,
        user: req.user._id,
    })

    if (!fromUserAcount) {
        return res.status(400).json({
            message:"System user account not found"
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const trasnsaction = new transactionMedel({
        fromAccount: fromUserAcount._id,
        toAccount,
        idempotencyKey,
        status:"PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAcount._id,
        amount: amount,
        trasnsaction: trasnsaction._id,
        type: "DEBIT",
    }], { session })
    
    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        trasnsaction: trasnsaction._id,
        type: "CREDIT"
    }],{ session })
    
    trasnsaction.status = "COMPLETED";
    await trasnsaction.save({ session });
    
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
        message: "Initial fund transaction completed successfully",
        trasnsaction: trasnsaction
    })
}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}
