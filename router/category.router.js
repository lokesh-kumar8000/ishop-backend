const {
  create,
  update,
  deleted,
  status,
  get,
} = require("../controller/category.controller");
const categoryRouter = require("express").Router();
const fileUploader = require("express-fileupload");
const authMiddleware = require("../middleware/authMiddleware");

categoryRouter.post(
  "/create",
  fileUploader({ createParentPath: true }),
  authMiddleware,
  create
);
categoryRouter.get("/:id?", get);
categoryRouter.patch("/status/:id", authMiddleware, status);
categoryRouter.delete("/delete/:id", authMiddleware, deleted);
categoryRouter.put(
  "/update/:id",
  fileUploader({ createParentPath: true }),
  authMiddleware,
  update
);
module.exports = categoryRouter;
