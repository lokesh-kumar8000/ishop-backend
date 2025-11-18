const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utility/response");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
//   console.log(token, "token");

  if (!token) {
    return errorResponse(res, "No Token provided, authorization denied");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRETY_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    errorResponse(res, "Token is invalid");
  }
};

module.exports = authMiddleware;
