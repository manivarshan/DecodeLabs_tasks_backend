// middleware/errorHandler.js
// Global error handler — catches all unhandled errors in the app

const errorHandler = (err, req, res, next) => {
  console.error('💥 Error:', err.message);
  console.error(err.stack);

  // MySQL duplicate entry error
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A record with this email already exists',
    });
  }

  // MySQL foreign key constraint error
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referenced record does not exist (invalid ID)',
    });
  }

  // Generic server error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
};

// 404 handler — for routes that don't exist
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
