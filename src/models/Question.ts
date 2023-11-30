import mongoose, { type Document, Schema } from 'mongoose'
import moment from 'moment-timezone'

enum QuestionCategory {
    Other = 'Other',
    Technical = 'Technical',
    Movie = 'Movie',
    Series = 'Web Series',
    Music = 'Music',
    Celebrity = 'Celebrity',
    Sports = 'Sports',
    Place = 'Place',
    Brand = 'Brand',
    Food = 'Food',
    Meme = 'Meme'
}
export interface IQuestion extends Document {
    creator: mongoose.Types.ObjectId
    answer: string
    modifiedAnswer: string
    hint?: string
    showedHint: string
    difficulty: number
    rating: number
    rateCount: number
    category: QuestionCategory
    image: string
    avgAttempts: number
    createdDate: Date
    updatedDate: Date
}

const questionSchema: Schema = new Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator ID is required']
    },
    answer: {
        type: String,
        minLength: 3,
        maxLegnth: 40,
        required: [true, 'Answer is required']
    },
    modifiedAnswer: {
        type: String,
        unique: true,
        message: 'Sorry Question already Added by Someone else'
    },
    hint: { type: String },
    showedHint: { type: String },
    difficulty: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Difficulty level is required']
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    rateCount: { type: Number, default: 0 },
    avgAttempts: { type: Number, default: 0 },
    category: {
        type: String,
        enum: Object.values(QuestionCategory),
        required: true
    },
    image: { type: String, required: [true, 'Image URL is required'] },
    createdDate: { type: Date, default: moment.tz('Asia/Kolkata').toDate() },
    updatedDate: { type: Date, default: moment.tz('Asia/Kolkata').toDate() }
})

const Question = mongoose.model<IQuestion>('Question', questionSchema)

export default Question
