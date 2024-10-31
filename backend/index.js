const express = require("express");
const cors = require("cors");
const router = require("./routes/index");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");

const app = express();
let userHitCount = 17;

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

app.use((req, res, next) => {
  userHitCount++;
  next();
});

app.get("/api/v1/hit-count", (req, res) => {
  res.json({ hits: userHitCount });
});

app.use("/api/v1", router);

app.listen(5000);
