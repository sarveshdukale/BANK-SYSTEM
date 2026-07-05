const mongoose = require("mongoose");

const tokenBlackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to blackLiat"],
        unique: [true,"Token is already Blacklsists"]
    },

    blackListAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    }
}, {
    timestamps: true
})

tokenBlackListSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 60 * 60 * 24 * 3
})


const tokenBlackListModel = mongoose.Model("tokenBlackList", tokenBlackListSchema);
module.exports = tokenBlackListModel
