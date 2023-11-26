import { type Request, type Response, type NextFunction } from 'express'
import { type MongoError } from 'mongodb'
import mongoose, { type Error as MongooseError } from 'mongoose'

const handleMongoErrors = (
    err: MongooseError | MongoError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // console.log(err)
    if (err instanceof mongoose.Error.ValidationError) {
        // Mongoose validation error
        let errors = ''
        for (const field in err.errors) {
            errors += err.errors[field].message
        }
        res.status(400).json({ success: false, message: errors })
    } else if (err instanceof mongoose.Error.CastError) {
        // Mongoose cast error
        res.status(400).json({ success: false, message: 'Invalid ID' })
    } else if (
        (err as MongoError).code === 11000 ||
        (err as MongoError).code === 11001
    ) {
        res.status(400).json({
            success: false,
            message: 'Duplicated Value'
        })
    } else {
        console.log(req.body, err)
        // Other Mongoose errors
        res.status(500).json({
            success: false,
            message: 'Error with the request'
        })
    }
}

export default handleMongoErrors
