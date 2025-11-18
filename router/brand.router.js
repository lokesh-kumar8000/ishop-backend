const fileUploader = require("express-fileupload");
const {
  create,
  read,
  status,
  deleted,
  update,
} = require("../controller/brand.controller");
const authMiddleware = require("../middleware/authMiddleware");

const brandRouter = require("express").Router();

brandRouter.post(
  "/create",
  fileUploader({ createParentPath: true }),
  authMiddleware,
  create
);
brandRouter.get("/:id?", read);
brandRouter.patch("/status/:id", authMiddleware, status);
brandRouter.delete("/delete/:id", authMiddleware, deleted);
brandRouter.put(
  "/update/:id",
  fileUploader({ createParentPath: true }),
  authMiddleware,
  update
);

module.exports = brandRouter;
