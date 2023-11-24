import mongoose, { type Document, Schema } from 'mongoose'
import moment from 'moment-timezone'

export interface IQuestion extends Document {
    creator: mongoose.Types.ObjectId
    image: string
    answer: string
    hint?: string
    createdDate: Date
    updatedDate: Date
    showedHint: string
    difficulty: number
    rating: number
    rateCount: number
}

const questionSchema: Schema = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator ID is required']
    },
    image: { type: String, required: [true, 'Image URL is required'] },
    answer: {
        type: String,
        required: [true, 'Answer is required'],
        unique: [true, 'Sorry Question already Added by Someone else']
    },
    hint: { type: String },
    showedHint: { type: String },
    difficulty: {
        type: Number,
        required: [true, 'Difficulty level is required']
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    rateCount: { type: Number, default: 0 },
    createdDate: { type: Date, default: moment.tz('Asia/Kolkata').toDate() },
    updatedDate: { type: Date, default: moment.tz('Asia/Kolkata').toDate() }
})

const Question = mongoose.model<IQuestion>('Question', questionSchema)

export default Question
