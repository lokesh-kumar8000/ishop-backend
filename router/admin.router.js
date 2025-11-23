const { login } = require("../controller/admin.controller");
const adminRouter = require("express").Router();

adminRouter.post("/login", login);
module.exports = adminRouter; 
