/*
CENTRAL ERROR HANDLING

WHY THIS MATTERS:

Console Error Logging --> Essential for debugging but should be removed/configured differently in production

statusCode Logic --> Allows custom error codes (e.g., throw new Error('...', { statusCode: 400 }))

Response Formatting --> Ensures frontend receives predictable error structure

Final Response --> Prevents empty responses and connection hangs
*/

const errorHandler = (err, req, res, next) => {
    // 1. Log the error details for debugging
    console.error('[ERROR]', err);
    
    // 2. Determine HTTP status code
    const statusCode = err.statusCode || 500;
    
    // 3. Standardize error response format
    const response = {
      success: false,
      message: err.message || 'Internal server error'
    };
  
    // 4. Send response
    res.status(statusCode).json(response);
};

module.exports = errorHandler;