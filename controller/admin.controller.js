const adminModel = require("../model/admin.model");
const { errorResponse, successResponse } = require("../utility/response");
var jwt = require("jsonwebtoken");
const admin = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const admin = await adminModel.findOne({ email: email });
      if (!admin) return errorResponse(res, "admin not found");
      if (password !== admin.password)
        return errorResponse(res, "password not match ");

      const token = jwt.sign(
        {
          id: admin._id,
          email: admin.email,
        },
        process.env.TOKEN_SECRETY_KEY,
        { expiresIn: "7d" }
      );
      res.cookie("admin_token", token, {
        maxAge: 7 * 24 * 1000 * 60 * 60, 
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      return successResponse(res, "admin login", token);
    } catch (error) {
      errorResponse(res, error);
    }
  },
};

module.exports = admin;
