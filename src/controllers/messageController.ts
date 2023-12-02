import { type NextFunction, type Request, type Response } from 'express'
import Message, { type IMessage } from '../models/Message'

// Controller for user registration
export const sendMsg = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { message } = req.body
        const newUser: IMessage = new Message({
            creator: req.user?._id,
            message
        })
        await newUser.save()
        res.send({ success: true, message: 'Sent' })
    } catch (error) {
        next(error)
    }
}
