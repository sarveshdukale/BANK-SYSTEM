const express = require("express");

const router = express.Router();
const authController = require("../controllers/auth.controller")


/* POST api/auth/register */
router.post("/register", authController.userRegisterControler);

/* POST api/auth/login */
router.post("/login", authController.userLoginControler);



module.exports = router