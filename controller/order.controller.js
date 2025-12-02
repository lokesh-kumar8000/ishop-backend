const cartModel = require("../model/cart.model");
const orderModel = require("../model/order.model");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { errorResponse, successResponse } = require("../utility/response");
const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const orderController = {
  async orderPlace(req, res) {
    try {
      const { user_id, payment_mode, shipping_details, name, email } = req.body;
      const cart = await cartModel
        .find({ user_id })
        .populate("product_id", "finalPrice _id");
      const productDetails = cart.map((item) => {
        return {
          product_Id: item?.product_id?._id,
          qty: item.qty,
          price: item.product_id.finalPrice,
          total: item.qty * item.product_id.finalPrice,
        };
      });
      const cart_total = productDetails.reduce(
        (sum, item) => sum + item.total,
        0
      );

      const order = await orderModel.create({
        user_id: user_id,
        product_details: productDetails,
        order_total: cart_total,
        payment_mode: payment_mode,
        shipping_details: shipping_details,
      });

      if (payment_mode == 0) {
        await order.save();
        await cartModel.deleteMany({ user_id });
        return res.status(201).json({
          success: true,
          message: "Order place",
          order_id: order._id,
        });
      } else {
        var options = {
          amount: cart_total * 100,
          currency: "INR",
          receipt: order._id,
        };
        instance.orders.create(options, async function (err, razorpayorder) {
          if (err) {
            console.log(err);
            return errorResponse(res, "order not create");
          } else {
            order.rozorpay_order_id = razorpayorder.id;
            res.status(201).json({
              success: true,
              message: "Order place",
              order_id: order._id,
              rozorpay_order_id: razorpayorder.id,
            });
            await order.save();
            return;
          }
        });
      }
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
  async successOrder(req, res) {
    try {
      const { order_id, user_id, razorpay_response } = req.body;
      const order = await orderModel.findById(order_id);
      if (!order) {
        return res.send({ message: "order not found", status: "error" });
      }
      if (order.payment_status == 1) {
        return res.send({ message: "order already paid", status: "error" });
      }
      // verify the payment
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(
          razorpay_response.razorpay_order_id +
            "|" +
            razorpay_response.razorpay_payment_id
        )
        .digest("hex");

      if (generated_signature !== razorpay_response.razorpay_signature) {
        return res.send({
          message: "payment verification failed ",
          status: "error",
        });
      }
      order.payment_status = 1;
      order.order_status = 1;
      order.rozorpay_payment_id = razorpay_response.razorpay_payment_id;
      await order.save();
      await cartModel.deleteMany({ user_id });
      res.send({
        message: "order placed successfull",
        status: "success",
        order_id: order._id,
      });
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
  // order get by id
  async orderGet(req, res) {
    try {
      const { id } = req.params;
      let orderList = null;
      if (id == null) {
        orderList = await orderModel.find().populate("user_id", "name _id");
      } else {
        orderList = await orderModel
          .find({ _id: id })
          .populate("user_id", "name _id");
      }
      if (orderList) {
        return successResponse(res, "Order List Found", orderList);
      }
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
  // order get by user id
  async orderGetByUser(req, res) {
    try {
      const { user_id } = req.params;
      let orderList = null;
      if (user_id == null) {
        orderList = await orderModel.find().populate("user_id", "name _id");
      } else {
        orderList = await orderModel
          .find({ user_id: user_id })
          .populate("user_id", "name _id");
      }
      if (orderList) {
        return successResponse(res, "Order List Found", orderList);
      }
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
  async removeOrder(req, res) {
    try {
      const { orderId, userId } = req.params;

      await orderModel.deleteOne({
        user_id: new mongoose.Types.ObjectId(userId),
        _id: new mongoose.Types.ObjectId(orderId),
      });
      const order = await orderModel.find({
        user_id: new mongoose.Types.ObjectId(userId),
      });
      return successResponse(res, "Order Cencel", order);
    } catch (error) {
      console.log(error);
      errorResponse(res);
    }
  },
};

module.exports = orderController;
