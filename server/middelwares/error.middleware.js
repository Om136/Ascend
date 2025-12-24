export const notFound = (req, res, next) => {
  res.status(404).json({
    message: "Not found",
    path: req.originalUrl,
  });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status =
    Number(err.statusCode) ||
    Number(err.status) ||
    (err.message === "Not allowed by CORS" ? 403 : 500);

  // Avoid leaking internal details in production
  const isProduction = process.env.NODE_ENV === "production";
  const message = status === 500 && isProduction ? "Server error" : err.message;

  if (!isProduction) {
    // Keep useful server logs in non-prod
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    message,
  });
};
