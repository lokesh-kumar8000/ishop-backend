require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var cookieParser = require("cookie-parser");
const categoryRouter = require("./router/category.router");
const colorRouter = require("./router/color.router");
const brandRouter = require("./router/brand.router");
const productRouter = require("./router/product.router");
const adminRouter = require("./router/admin.router");
const userRouter = require("./router/user.router");
const cartRouter = require("./router/cart.router");
const orderRouter = require("./router/order.router");
const contactRouter = require("./router/contact.roter");
const server = express();
server.use(cors({ origin: "http://localhost:3000", credentials: true }));
server.use(cookieParser());
server.use(express.json());
server.use("/category", categoryRouter);
server.use("/color", colorRouter);
server.use("/brand", brandRouter);
server.use("/product", productRouter);
server.use("/admin", adminRouter);
server.use("/user", userRouter);
server.use("/cart", cartRouter);
server.use("/order", orderRouter);
server.use("/contact", contactRouter);
server.use(express.static("./public"));

server.listen(5000, () => {
  console.log("server Runing PORT 5000  ");
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Data base connected");
    })
    .catch((err) => {
      console.log(err);
    });
});
