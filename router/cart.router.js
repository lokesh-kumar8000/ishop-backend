const {
  moveDB,
  addtoCart,
  removeCart,
  updateDb,
} = require("../controller/cart.controller");

const cartRouter = require("express").Router();

// cartRouter.get("/", get);
cartRouter.post("/sync", moveDB);
cartRouter.post("/add-to-cart", addtoCart);
cartRouter.delete("/delete-cart/:id/:userId", removeCart);
cartRouter.patch("/inc-to-dec/:id/:userId/:flag", updateDb);

module.exports = cartRouter;
