require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const connectDB = require("./config/database");

const perfumeRouter = require("./routes/perfumeRouter");
const brandRouter = require("./routes/brandRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const paymentRouter = require("./routes/paymentRouter");
const chatRouter = require("./routes/chatRouter");
const commentRouter = require("./routes/commentRouter");
const orderRouter = require("./routes/orderRouter");
var app = express();
connectDB();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/brand", brandRouter);
app.use("/api/perfume", perfumeRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/chat", chatRouter);
app.use("/api/comment", commentRouter);
app.use("/api/order", orderRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
