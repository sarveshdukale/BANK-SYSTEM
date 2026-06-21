const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");


async function authMiddleware(req, res, next) {
    
    const token = req.cookies.token || req.header.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access. Token Missing"
        })
    }
}