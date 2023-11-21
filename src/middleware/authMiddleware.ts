import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import envVariables from '../config/config'
import User from '../models/User'

export const checkToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]
    if (token == null) {
        res.status(401).json({ success: false, message: 'Please Login' })
        return
    }

    jwt.verify(token, envVariables.JWT_SECRET, async (err: any, data: any) => {
        if (err != null) {
            res.status(403).json({
                success: false,
                message: 'Please Login'
            })
            return
        }
        const user = await User.findById(data.userId)
        if (user !== null) {
            req.user = user
            next()
        } else {
            res.status(403).json({
                success: false,
                message: 'Please Login'
            })
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
    }
}
