const {
  create,
  read,
  status,
  deleted,
  update,
} = require("../controller/color.controller");
const authMiddleware = require("../middleware/authMiddleware");

const colorRouter = require("express").Router();

colorRouter.post("/create", authMiddleware, create);
colorRouter.get("/:id?", read);
colorRouter.patch("/status/:id", authMiddleware, status);
colorRouter.delete("/delete/:id", authMiddleware, deleted);
colorRouter.put("/update/:id", authMiddleware, update);
module.exports = colorRouter;
