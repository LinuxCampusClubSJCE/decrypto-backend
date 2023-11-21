// import { Request } from 'express'
import { type IUser } from './models/User' // Assuming IUser is the User model interface

// Declare a new interface that extends the existing Request interface
declare module 'express' {
    interface Request {
        user?: IUser // Add the user property to Request
    }
}
