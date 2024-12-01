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

    //Sender's Account
    const account = await Account.findOne({ userId: req.userId }).session(session);
    if (!account || account.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Recipient's account
    const transferAccount = await Account.findOne({ userId: transferTo }).session(session);
    if (!transferAccount) {
      throw new Error("Invalid account");
    }

    // Deducting from sender's account
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } },
      { session }
    );

    // Adding to recipient's account
    await Account.updateOne(
      { userId: transferTo },
      { $inc: { balance: amount } },
      { session }
    );

    await session.commitTransaction();
    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

module.exports = { getBalance, transferMoney };
