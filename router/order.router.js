const {
  orderPlace,
  orderGet,
  removeOrder,
  successOrder,
  orderGetByUser,
} = require("../controller/order.controller");
const auth = require("../middleware/authMiddleware");
const orderRouter = require("express").Router();

orderRouter.post("/order-place", orderPlace);
orderRouter.get("/get/:id?", orderGet);
orderRouter.get("/getUser/:user_id?", orderGetByUser);
orderRouter.delete("/remove-oder/:userId/:orderId", removeOrder);
orderRouter.post("/success", auth, successOrder);

module.exports = orderRouter;
