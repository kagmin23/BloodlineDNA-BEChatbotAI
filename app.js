// app.js

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors"); // ✅ Thêm CORS

// Routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const chatRoutes = require("./routes/chat.routes");

// Load biến môi trường
require("dotenv").config();

const app = express();

// ✅ Cấu hình CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Routers
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/chatbotAI", chatRoutes); // BE endpoint

module.exports = app;
