const ErrorHandler = (error, req, res) => {
  console.error(error);

  res.status(418).json({
    success: false,
    message: error.message,
  });
};

export default ErrorHandler;
