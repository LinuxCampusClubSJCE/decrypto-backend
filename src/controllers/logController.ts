import { type NextFunction, type Request, type Response } from 'express'
import Log from '../models/Log'

export const getAllLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const logs = await Log.find({}).populate('creator', 'fullName username')
        res.send({ success: true, logs })
    } catch (error) {
        next(error)
    }
}
export const deleteAllLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await Log.deleteMany({})
        res.send({ success: true, message: 'deleted' })
    } catch (error) {
        next(error)
    }
}
