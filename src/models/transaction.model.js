const mongoose = require("mongoose");


const trasactionSchema = new mongoose.Schema({

    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Trasncation must be associated with a from account"],
        index : true
    }, 
    
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Trasncation must be associated with a to account"],
        index : true
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message:"Status can be either PENDING , COMPLETED, FAILED or REVERSED"
        },
        default:"PENDING"
    },

    ammount: {
        type: Number,
        required: [true, "Ammount is required for creating a transaction"],
        min:[0,"Transaction ammount cannot be negative"],
    },

    idempotencyKey: {
        type: String,
        required: [true, "IdempotencyKey is required for creating a trasnsaction"],
        index: true,
        unique:true,
    }
}, {
        timestamps: true
})


const transactionMedel = mongoose.model("transaction", trasactionSchema);

module.exports = transactionMedel