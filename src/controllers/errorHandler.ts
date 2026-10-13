import type { ErrorRequestHandler } from "express"
import { AppError } from "../errors/AppError.js"

export const errorHandler: ErrorRequestHandler = (err, _, res, next) => {
    if (res.headersSent) {
        next(err)
        return
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: "error",
            message: err.message
        })
        
        return
    }

    console.error(err)

    res.status(500).json({
        status: "error",
        message: "Internal server error"
    })
}
