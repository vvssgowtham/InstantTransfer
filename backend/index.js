const express = require("express");
const cors = require("cors");
const router = require("./routes/index");
const connectDB = require("./db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.listen(5000);
