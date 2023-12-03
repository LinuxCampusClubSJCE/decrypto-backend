import { type Request } from 'express'
import Log from './models/Log'
import moment from 'moment-timezone'

export const Logger = async (req: Request, message: string): Promise<void> => {
    await Log.create({
        creator: req.user?._id,
        message,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        createdDate: moment.tz('Asia/Kolkata').toDate()
    })
}
