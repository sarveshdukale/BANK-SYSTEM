const express = require("express");

const router = express.Router();
const authController = require("../controllers/auth.controller")


/* POST api/auth/register */
router.post("/register", authController.userRegisterControler);

/* POST api/auth/login */
router.post("/login", authController.userLoginControler);

/**
 * - POST /api/auth/logout
 */

router.post("/logout",authController.)


module.exports = router