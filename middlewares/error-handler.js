function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({message: "The user is not authorized"})
    }

    if (err.name === 'ValidationError') {
        //  validation error
        return res.status(400).json(err)
    }

    const errMsg = err.message || '500 internal server';
    // default to 500 server error
    return res.status(500).json({
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : ''
    });
}

module.exports = errorHandler;