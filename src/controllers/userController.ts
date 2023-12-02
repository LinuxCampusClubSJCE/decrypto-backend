import { type NextFunction, type Request, type Response } from 'express'
import User, { type IUser } from '../models/User' // Assuming IUser is the User model interface
import bcrypt from 'bcrypt'
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const users: IUser[] = await User.find().populate(
            'firstToCrack',
            'answer'
        ) // Assuming User is the Mongoose model
        res.json({ success: true, users })
    } catch (error) {
        next(error)
    }
    // No explicit return here, allowing the function to implicitly return void
}
export const getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.params.id // Assuming user ID is passed as a parameter
        if (
            req.user !== undefined &&
            !req.user.isAdmin &&
            req.user._id.toString() !== userId
        ) {
            res.status(400).json({ success: false, message: 'Not authorized' })
            return
        }
        const user: IUser | null = await User.findById(userId) // Assuming User is the Mongoose model
        if (user != null) {
            res.json({ success: true, user })
        } else {
            res.status(400).json({ success: false, message: 'User not found' })
        }
    } catch (error) {
        next(error)
    }
    // No explicit return here, allowing the function to implicitly return void
}
export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const userId = req.params.id
    const updatedUserData = req.body
    try {
        if (
            req.user !== undefined &&
            !req.user.isAdmin &&
            req.user._id.toString() !== userId
        ) {
            res.status(400).json({
                success: false,
                message: 'Not authorized'
            })
            return
        }
        if (req.user !== undefined && !req.user?.isAdmin) {
            delete updatedUserData.isTeam
            delete updatedUserData.isAdmin
            delete updatedUserData.username
            delete updatedUserData.solvedQuestions
            delete updatedUserData.codeName
        }
        if (updatedUserData.password !== undefined) {
            const hashedPassword = await bcrypt.hash(
                updatedUserData.password,
                10
            )
            updatedUserData.password = hashedPassword
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedUserData,
            { new: true }
        )
        if (updatedUser == null) {
            res.status(404).json({ success: false, message: 'User not found' })
            return
        }
        res.json({ success: true, message: 'updated', user: updatedUser })
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const userId = req.params.id
    try {
        const deletedUser = await User.findByIdAndDelete(userId)
        if (deletedUser == null) {
            res.status(404).send({ success: false, meesage: 'User not found' })
            return
        }
        res.json({ success: true, message: 'User deleted successfully' })
    } catch (error) {
        next(error)
    }
}

export const getLeaderboard = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const users: IUser[] = await User.find({
            isAdmin: false,
            isTeam: false
        })
            .sort({ solvedQuestions: -1, lastSolvedTime: 1 }) // Sort by solvedQuestions descending, lastSolvedTime ascending
            .select(
                'fullName username solvedQuestions attempts firstToCrack lastSolvedTime'
            )
        const bigBrains = [...users]
            .sort((a, b) => b.firstToCrack.length - a.firstToCrack.length)
            .slice(0, 3)
            .map((user) => ({
                _id: user._id,
                username: user.username,
                solvedQuestions: user.solvedQuestions,
                fullName: user.fullName,
                totalCrack: user.firstToCrack.length
            }))

        const top15Solved = [...users].slice(0, 15)
        const fastFingers = top15Solved
            .sort((a, b) => {
                const avgAttemptsA = a.attempts.reduce(
                    (total, i) => total + i,
                    0
                )
                const avgAttemptsB = b.attempts.reduce(
                    (total, i) => total + i,
                    0
                )
                return avgAttemptsB - avgAttemptsA
            })
            .slice(0, 3)
            .map((user) => ({
                _id: user._id,
                username: user.username,
                solvedQuestions: user.solvedQuestions,
                fullName: user.fullName,
                totalAttempts: user.attempts.reduce((total, i) => total + i, 0)
            }))

        res.send({ success: true, leaderboard: users, fastFingers, bigBrains })
    } catch (error) {
        next(error)
    }
}
export const getTeamLeaderboard = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const leaderboard: IUser[] = await User.find(
            { isTeam: true },
            'fullName solvedQuestions'
        )
            .sort({ solvedQuestions: -1, lastSolvedTime: 1 })
            .exec()
        res.json({ success: true, leaderboard })
    } catch (error) {
        next(error)
    }
}
