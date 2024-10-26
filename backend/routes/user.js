const express = require("express");
const { signUp, signIn, updateUser,filterUser } = require("../controllers/userController");
const authMiddleware = require("../middleware");

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.put("/update", authMiddleware, updateUser);
router.get("/bulk",authMiddleware,filterUser);

module.exports = router;