import { type NextFunction, type Request, type Response } from 'express'
import Message, { type IMessage } from '../models/Message'
import moment from 'moment'

// Controller for user registration
export const sendMsg = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { message } = req.body
        const newMessage: IMessage = new Message({
            creator: req.user?._id,
            message,
            createdDate: moment.tz('Asia/Kolkata').toDate()
        })
        await newMessage.save()
        res.send({ success: true, message: 'Sent' })
    } catch (error) {
        next(error)
    }
}
export const getAllMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const messages = await Message.find({}).populate(
            'creator',
            'fullName username'
        )
        res.send({ success: true, messages })
    } catch (error) {
        next(error)
    }
}
export const deleteAllMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await Message.deleteMany({})
        res.send({ success: true, message: 'deleted' })
    } catch (error) {
        next(error)
    }
}
