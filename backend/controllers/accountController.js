const { Account } = require("../models/user");
const { default: mongoose } = require('mongoose');

const getBalance = async (req, res) => {
  const account = await Account.findOne({ userId: req.userId });
  res.json({
    balance: account.balance,
  });
};

const transferMoney = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { transferTo, amount } = req.body;
    
    //validation
    if (!transferTo || !amount || amount <= 0) {
      throw new Error("Invalid transfer details");
    }

    const transferAmount = Number(amount);

    // Sender's Account
    const account = await Account.findOne({ userId: req.userId }).session(session);
    if (!account) {
      throw new Error("Sender account not found");
    }
    
    if (account.balance < transferAmount) {
      throw new Error("Insufficient balance");
    }

    // Recipient's account
    const transferAccount = await Account.findOne({ userId: transferTo }).session(session);
    if (!transferAccount) {
      throw new Error("Recipient account not found");
    }

    // Deducting from sender's account
    const senderUpdate = await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -transferAmount } },
      { session, new: true }
    );

    // Adding to recipient's account
    const recipientUpdate = await Account.updateOne(
      { userId: transferTo },
      { $inc: { balance: transferAmount } },
      { session, new: true }
    );

    // Verifying updates
    if (senderUpdate.modifiedCount !== 1 || recipientUpdate.modifiedCount !== 1) {
      throw new Error("Transfer failed");
    }

    await session.commitTransaction();
    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Transfer error:", error);
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

module.exports = { getBalance, transferMoney };
