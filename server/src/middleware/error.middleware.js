export const errorMiddleware = (err, req, res, next) => {
    // Log in dev
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', err.message);
        console.error(err.stack);
    }

    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Something broke in the night.';

    // Guard: if headers already sent, delegate to Express default
    if (res.headersSent) return next(err);

    return res.status(status).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};