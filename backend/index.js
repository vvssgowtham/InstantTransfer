const express = require("express");
const cors = require("cors");
const router = require("./routes/index");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");

const app = express();

connectDB();

app.use(
  cors({
    origin: "https://instant-transfer-virid.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", router);

app.listen(5000);
