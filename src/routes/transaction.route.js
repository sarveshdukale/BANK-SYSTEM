const Router = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");





const transactionRoutes = Router();

/**
 * - POST /api/transaction/
 * - Create a new trasnsaction
 */


transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction,);


module.exports = transactionRoutes;