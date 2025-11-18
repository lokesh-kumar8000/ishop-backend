const {
  register,
  login,
  address,
  get,
  remove,
  updatePassword,
} = require("../controller/user.controller");
const userRouter = require("express").Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.put("/address/:userId", address);
userRouter.get("/get/:id?", get);
userRouter.delete('/delete/:id/:index', remove )
userRouter.put("/password-update/:user_id",updatePassword)
module.exports = userRouter;
