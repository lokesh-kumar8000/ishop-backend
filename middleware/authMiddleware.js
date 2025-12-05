const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utility/response");

const authMiddleware = (req, res, next) => {
  let authHeader = req.headers.authorization;

  if (!authHeader) {
    return errorResponse(res, "No token provided, authorization denied", 401);
  }

  // Format: "Bearer token_here"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return errorResponse(res, "Token missing or invalid", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRETY_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("JWT ERROR:", error);
    return errorResponse(res, "Token is invalid", 401);
  }
};

module.exports = authMiddleware;
