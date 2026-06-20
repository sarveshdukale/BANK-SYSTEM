const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/** 
* - User register controller
* - POST /api/auth/register
*/

async function userRegisterControler(req , res) {
    
    const { email, username, password } = req.body;

    const isExist = await userModel.findOne({
        email : email
    })

    if (isExist) {
        return res.status(422).json({
            message: "User already exist with this email.",
            status : "failed"
        })
    }

    const user = await userModel.create({
        email, password, name 
    })

}

module.exports = {
    userRegisterControler
}