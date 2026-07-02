const Router = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");





const transactionRoutes = Router();

/**
 * - POST /api/transaction/
 * - Create a new trasnsaction
 */

transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction,);

/**
 * - POST/api/transactions/system/initial-fund
 * - Create initial fund transactions from system user
 */

transactionRoutes.post("/system/initial-funds",authMiddleware.authSyatemUserMedeelware         )

module.exports = transactionRoutes;