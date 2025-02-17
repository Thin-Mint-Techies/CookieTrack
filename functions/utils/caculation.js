const logExecutionTime = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => { // Fires when response is sent
        const duration = Date.now() - start;
        console.log(`[${req.method}] ${req.originalUrl} - ${duration}ms`);
    });

    next();
};

module.exports = {
    logExecutionTime,
};