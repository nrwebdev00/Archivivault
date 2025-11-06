class customError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode
        this.name = 'Custom Error';
        Error.captureStackTrace(this, this.constructor);
    }
}

export { customError }