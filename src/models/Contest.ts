import mongoose, { Schema, type Document } from 'mongoose'

interface IContest extends Document {
    name: string
    questionOrder: mongoose.Types.ObjectId[]
    startTime: Date
    endTime: Date
}

const ContestSchema: Schema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name should be at least 3 characters'],
        maxlength: [16, 'Name should not exceed 16 characters']
    },
    questionOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    startTime: { type: Date, required: [true, 'Start time is required'] },
    endTime: { type: Date, required: [true, 'End time is required'] }
})

const Contest = mongoose.model<IContest>('Contest', ContestSchema)

export default Contest
