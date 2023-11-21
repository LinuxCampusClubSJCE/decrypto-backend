import mongoose, { type Document, Schema } from 'mongoose'
import moment from 'moment-timezone'

export interface IQuestion extends Document {
    creator: mongoose.Types.ObjectId
    image: string
    answer: string
    hint?: string
    createdDate: Date
    updatedDate: Date
    difficulty: number
}

const questionSchema: Schema = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator ID is required']
    },
    image: { type: String, required: [true, 'Image URL is required'] },
    answer: { type: String, required: [true, 'Answer is required'] },
    hint: { type: String },
    difficulty: {
        type: Number,
        required: [true, 'Difficulty level is required']
    },
    createdDate: { type: Date, default: moment.tz('Asia/Kolkata').toDate() },
    updatedDate: { type: Date, default: moment.tz('Asia/Kolkata').toDate() }
})

const Question = mongoose.model<IQuestion>('Question', questionSchema)

export default Question
