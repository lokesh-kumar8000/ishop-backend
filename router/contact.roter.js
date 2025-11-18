const { default: contact } = require("../controller/contact.controller");

const contactRouter = require("express").Router();

contactRouter.post("/msg",contact.message);

module.exports = contactRouter;
