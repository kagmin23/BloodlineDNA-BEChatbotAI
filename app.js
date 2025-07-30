const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // serverSelectionTimeoutMS: 30000,
      // socketTimeoutMS: 30000,
    });
    console.log("✅  MongoDB Atlas connected");
  } catch (err) {
    console.error("❌  MongoDB connection error:", err);
  }
})();

// cors
const whitelist = (process.env.FRONTEND_URLS || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      // Cho phép Postman/thunder client (origin === undefined) và origin nằm trong whitelist
      if (!origin || whitelist.includes(origin)) {
        return cb(null, true);
      }
      console.warn(`❌ Blocked CORS request from origin: ${origin}`);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/api/chatbotAI", require("./routes/chat.routes"));

module.exports = app;
