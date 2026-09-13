export const errorHandler = (err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

export class AppError extends Error {
    constructor(message, status) {
        super(message);

        this.status = status;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad Request") {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(message, 409);
    }
}