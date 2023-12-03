import { type NextFunction, type Request, type Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User, { type IUser } from '../models/User'
import envVariables from '../config/config'
import Contest from '../models/Contest'
import { Logger } from '../Logger'

// Controller for user registration
export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const contest = await Contest.findOne({})
        if (contest !== null && !contest.allowRegistration) {
            void Logger(req, 'contest not started')
            res.status(400).json({
                success: false,
                message: 'Registration Not Started'
            })
            return
        }
        const { fullName, username, email, usn, phone, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser: IUser = new User({
            fullName,
            username,
            phone,
            email,
            usn,
            password: hashedPassword
        })
        await newUser.save()
        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        })
    } catch (error) {
        next(error)
    }
}

// Controller for LCC Team registration
export const registerTeam = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            fullName,
            username,
            codeName,
            email,
            usn,
            phone,
            password,
            isTeam,
            isAdmin
        } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser: IUser = new User({
            fullName,
            username,
            codeName,
            email,
            usn,
            phone,
            password: hashedPassword,
            isTeam,
            isAdmin
        })
        await newUser.save()
        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        })
    } catch (error) {
        next(error)
    }
}

// Controller for user login
export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({
            $or: [{ email: username }, { username }]
        }).select('_id username email password fullName isTeam isAdmin')
        if (user == null) {
            res.status(400).json({
                success: false,
                message: 'Invalid username/password'
            })
            void Logger(
                req,
                'invalid login not found' + username + ' ' + password
            )
            return
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            void Logger(
                req,
                'invalid login password incorrect' + username + ' ' + password
            )
            res.status(400).json({
                success: false,
                message: 'Invalid username/password'
            })
            return
        }
        const accessToken = jwt.sign(
            { userId: user._id },
            envVariables.JWT_SECRET,
            {
                expiresIn: '2d'
            }
        )
        res.json({
            success: true,
            message: 'Successfully Logged in',
            accessToken,
            user
        })
        if (user.isAdmin) {
            void Logger(req, 'Login admin ' + user.username)
        }
    } catch (error) {
        next(error)
    }
}

export const checkLogin = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.json({ success: true })
}
export const checkRegistration = async (
    req: Request,
    res: Response
): Promise<void> => {
    const contest = await Contest.findOne({})
    let started: boolean
    if (contest == null) {
        started = true
    } else {
        started = contest.allowRegistration
    }

    res.json({ success: true, started })
}
