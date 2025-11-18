const successResponse = (
  res,
  message = "success",
  data = {},
  statusCode = 200
) => {
  const response = {
    success: true,
    status: "success",
    message,
    timestamp: new Date().toISOString(),
    data,
  };
  return res.status(statusCode).json(response);
};

const errorResponse = (
  res,
  message = "Internal server error",
  data = {},
  statusCode = 500
) => {
  const response = {
    success: false,
    status: "error",
    message,
    timestamp: new Date().toISOString(),
    data,
  };
  return res.status(statusCode).json(response);
};
const bedResponse = (res, message = "Error", data = {}, statusCode = 400) => {
  const response = {
    success: false,
    status: "error",
    message,
    timestamp: new Date().toISOString(),
    data,
  };
  return res.status(statusCode).json(response);
};

const createdSuccess = (
  res,
  message = " Resource created successfully ",
  data = {}
) => {
  return successResponse(res, message, data, 201);
};

const updateresponse = (
  res,
  message = "Resource Updated successfully ",
  data = {}
) => {
  return successResponse(res, message, data, 200);
};

const deletedresponse = (
  res,
  message = "Resource Deleted successfully ",
  data = {}
) => {
  return successResponse(res, message, data, 200);
};

module.exports = {
  successResponse,
  createdSuccess,
  errorResponse,
  deletedresponse,
  updateresponse,
  bedResponse,
};
