const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

/* -------------------- APP INIT -------------------- */
const app = express();

/* -------------------- DATABASE -------------------- */
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

/* -------------------- CORS -------------------- */
const whitelist = process.env.FRONTEND_URLS?.split(",").map((url) => url.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || whitelist.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* -------------------- MIDDLEWARE -------------------- */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/* -------------------- ROUTERS -------------------- */
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/api/chatbotAI", require("./routes/chat.routes"));

module.exports = app;
