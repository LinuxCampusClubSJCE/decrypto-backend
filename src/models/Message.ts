import mongoose, { type Document, Schema } from 'mongoose'
import moment from 'moment-timezone'

export interface IMessage extends Document {
    creator: mongoose.Types.ObjectId
    message: string
    createdDate: Date
}

const messageSchema: Schema = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator ID is required']
    },
    message: {
        type: String,
        minLength: 1,
        maxLegnth: 100,
        required: [true, 'Answer is required']
    },
    createdDate: { type: Date, default: moment.tz('Asia/Kolkata').toDate() }
})

const Message = mongoose.model<IMessage>('Message', messageSchema)

export default Message
