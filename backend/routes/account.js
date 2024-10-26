const express = require("express");
const {
  getBalance,
  transferMoney,
} = require("../controllers/accountController");
const authMiddleware = require("../middleware");
const router = express.Router();

router.get("/balance", authMiddleware, getBalance);
router.post("/transfer", authMiddleware, transferMoney);

module.exports = router;
