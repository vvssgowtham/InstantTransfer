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
  session.startTransaction();

  const { transferTo, amount } = req.body;
  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const transferAccount = await Account.findOne({ userId: transferTo }).session(
    session
  );

  if (!transferAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);

  await Account.updateOne(
    { userId: transferTo },
    {
      $inc: { balance: amount },
    }
  ).session(session);

  await session.commitTransaction();

  res.status(200).json({
    message: "Transfer successful",
  });
};

module.exports = { getBalance, transferMoney };
