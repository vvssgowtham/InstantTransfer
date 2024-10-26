const { z } = require("zod");
const { User, Account } = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const userSchema = z.object({
  userName: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
});

const optionalUserSchema = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const signUp = async (req, res) => {
  const { success } = userSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const { userName, firstName, lastName, password } = req.body;
  const user = await User.findOne({ userName: userName });
  if (user) {
    return res.status(411).json({
      message: "Email already taken",
    });
  }

  const newUser = new User({ userName, firstName, lastName, password });
  await newUser.save();
  const newUserId = newUser._id;

  const account = new Account({
    userId: newUserId,
    balance: 1 + Math.random() * 1000,
  });

  await account.save();

  const token = jwt.sign(
    {
      userId: newUserId,
    },
    JWT_SECRET
  );
  return res.status(200).json({
    message: "User created successfully",
    token: token,
  });
};

const signIn = async (req, res) => {
  const { success } = userSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const { userName, password } = req.body;
  const existingUser = await User.findOne({
    userName: userName,
    password: password,
  });
  if (!existingUser) {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }

  const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);
  return res.status(200).json({
    message: "Login Success & Token Created Successfully",
    token: token,
  });
};

const updateUser = async (req, res) => {
  const { success } = optionalUserSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }
  await User.updateOne({ _id: req.userId }, req.body);
  res.status(200).json({
    message: "Updated successfully",
  });
};

const filterUser = async (req, res) => {
  const nameToFilter = req.query.filter;
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: nameToFilter,
        },
      },
      {
        lastName: {
          $regex: nameToFilter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
};

module.exports = {
  signUp,
  signIn,
  updateUser,
  filterUser,
};
