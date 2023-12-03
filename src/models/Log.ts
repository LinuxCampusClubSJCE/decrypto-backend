import mongoose, { type Document, Schema } from 'mongoose'
import moment from 'moment-timezone'

export interface ILog extends Document {
    creator: mongoose.Types.ObjectId
    ip: string
    userAgent: string
    message: string
    createdDate: Date
}

const logSchema: Schema = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String
    },
    userAgent: {
        type: String
    },
    ip: {
        type: String
    },
    createdDate: { type: Date, default: moment.tz('Asia/Kolkata').toDate() }
})

const Log = mongoose.model<ILog>('Log', logSchema)

export default Log
