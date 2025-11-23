const productRouter = require("express").Router();
const fileUpload = require("express-fileupload");
const {
  create,
  read,
  status,
  deleted,
  updated,
} = require("../controller/product.controller");
const authMiddleware = require("../middleware/authMiddleware");

productRouter.post(
  "/create",
  fileUpload({ createParentPath: true }),
  authMiddleware,
  create
);
productRouter.get("/:id?", read);
productRouter.patch("/status/:id", authMiddleware, status); 
productRouter.delete("/delete/:id", authMiddleware, deleted); 
productRouter.put( 
  "/update/:id", 
  fileUpload({ createParentPath: true }), 
  authMiddleware, 
  updated
);

module.exports = productRouter;
