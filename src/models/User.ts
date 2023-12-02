import moment from 'moment-timezone'
import mongoose, { type Document, Schema } from 'mongoose'

export interface IUser extends Document {
    fullName: string
    username: string
    codeName?: string
    email: string
    usn: string
    phone: string
    password: string
    attempts: number[]
    isAdmin: boolean
    isTeam: boolean
    createdDate: Date
    firstToCrack: mongoose.Schema.Types.ObjectId[]
    solvedQuestions: number
    lastSolvedTime: Date
}

const userSchema: Schema = new Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        lowercase: true,
        trim: true,
        minLength: [4, 'Username should be at least 4 characters'],
        unique: true,
        message: ''
    },
    codeName: {
        type: String,
        trim: true,
        minLength: [4, 'CodeName should be at least 4 characters']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    usn: {
        type: String,
        required: [true, 'USN is required'],
        trim: true,
        uppercase: true,
        minLength: [11, 'USN should be at least 11 characters'],
        maxLength: [14, 'USN should not exceed 14 characters']
    },
    phone: { type: String, required: [true, 'Phone number is required'] },
    solvedQuestions: { type: Number, default: 0 },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password should be at least 8 characters'],
        maxLength: [64, 'Password should not exceed 64 characters']
    },
    firstToCrack: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    attempts: [{ type: Number, default: [] }],
    isAdmin: { type: Boolean, default: false },
    isTeam: { type: Boolean, default: false },
    createdDate: { type: Date, default: moment.tz('Asia/Kolkata').toDate() },
    lastSolvedTime: { type: Date, default: 0 }
})

const User = mongoose.model<IUser>('User', userSchema)

export default User
