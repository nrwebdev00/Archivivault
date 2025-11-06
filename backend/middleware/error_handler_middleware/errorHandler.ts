import type { Request, Response, NextFunction } from "express";

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        msg:'error',
        error: message,
        ...(process.env.NODE_ENV == "development" && { stack: err.stack })
    });
    return;
}

export { errorHandler }