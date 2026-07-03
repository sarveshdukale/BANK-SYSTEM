const trasnsactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const { default: mongoose } = require("mongoose");
const transactionMedel = require("../models/transaction.model");



async function createTransaction(req,res) {
    
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    
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
