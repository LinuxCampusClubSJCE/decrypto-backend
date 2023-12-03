import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import envVariables from '../config/config'
import User from '../models/User'
import { Logger } from '../Logger'

export const checkToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.log(
        req.clientIp,
        req.headers['x-forwarded-for'],
        req.socket.remoteAddress
    )
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]
    if (token == null) {
        res.status(401).json({ success: false, message: 'Please Login' })
        void Logger(req, 'token null')
        return
    }

    jwt.verify(token, envVariables.JWT_SECRET, async (err: any, data: any) => {
        if (err != null) {
            console.log({ err })
            res.status(403).json({
                success: false,
                message: 'Please Login'
            })
            void Logger(req, `jwt verify error ${err}`)
            return
        }
        const user = await User.findById(data.userId)
        if (user !== null) {
            req.user = user
            next()
        } else {
            console.log('user not found')
            res.status(403).json({
                success: false,
                message: 'Please Login'
            })
            void Logger(req, 'user not found')
        }
    })
}
export const checkAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (req.user != null && req.user?.isAdmin) {
        next()
    } else {
        res.status(401).json({ success: false, message: 'You are not Admin' })
        void Logger(req, 'not admin')
    }
}
export const checkTeam = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (req.user != null && (req.user?.isTeam || req.user?.isAdmin)) {
        next()
    } else {
        res.status(401).json({
            success: false,
            message: 'You are not member of LCC'
        })
        void Logger(req, 'not lcc')
    }
}
