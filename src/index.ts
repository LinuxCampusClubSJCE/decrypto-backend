import express, {
    type NextFunction,
    type Express,
    type Request,
    type Response
} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db'
import envVariables from './config/config'
import swaggerRoute from './routes/swagger'
import authRoutes from './routes/authRoutes' // Import your authentication routes
import { rateLimit } from 'express-rate-limit'
import userRoutes from './routes/userRoutes' // Import your user routes
import questionRoutes from './routes/questionRoutes' // Import your user routes
import logRouters from './routes/logRoutes' // Import your user routes
import messageRoutes from './routes/messageRoutes' // Import your message routes
import { checkToken } from './middleware/authMiddleware'
import createAdminUser from './seeder/admin'
import contestRoutes from './routes/contestRoutes'
import handleMongoErrors from './middleware/mongooseError'
import mongoose from 'mongoose'
import requestIp from 'request-ip'
dotenv.config()

const app: Express = express()
const port = envVariables.PORT

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-7',
    legacyHeaders: false
})

connectDB().catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
})

app.use(
    cors({
        origin: '*'
    })
)
app.use(requestIp.mw())
app.use(limiter)
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.json({ success: true, message: '✅ Server is Running' })
})

app.get('/api', (req: Request, res: Response) => {
    res.json({ success: true, message: '✅ Server is Running' })
})

// Define routes
app.use('/api/auth', authRoutes) // Authentication routes
app.use('/api/users', userRoutes) // User routes
app.use('/api/question', checkToken, questionRoutes) // Question routes
app.use('/api/contest', contestRoutes) // Contest routes
app.use('/api/message', messageRoutes) // message routes
app.use('/api/logs', logRouters) // Log routes

app.use('/api-docs', swaggerRoute)
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    handleMongoErrors(err, req, res, next)
})

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    })
})

const db = mongoose.connection

db.once('open', () => {
    void createAdminUser()
    app.listen(port, () => {
        console.log(
            `⚡️[server]: Server is running at http://localhost:${port}`
        )
    })
})
