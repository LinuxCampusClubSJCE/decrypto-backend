import { type NextFunction, type Request, type Response } from 'express'
import Contest from '../models/Contest' // Import the Contest model
import moment from 'moment-timezone'

// Controller to add a new contest
export const getDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const currentTime = moment().tz('Asia/Kolkata') // Get current time in IST
        const contest = await Contest.findOne({})
        if (contest == null) {
            res.json({ success: false, message: 'Contest not found' })
            return
        }
        if (contest.forceState === 'stop') {
            res.json({ success: false, message: 'Contest is over' })
            return
        }
        if (contest.forceState === 'start') {
            res.json({
                success: true,
                message: 'Contest started'
            })
            return
        }
        const startTime = moment(contest.startTime).tz('Asia/Kolkata')
        const endTime = moment(contest.endTime).tz('Asia/Kolkata')
        if (!currentTime.isBetween(startTime, endTime, 'minute', '[]')) {
            res.json({
                success: true,
                message: 'Contest Not started',
                started: false,
                startTime: contest.startTime,
                endTime: contest.endTime
            })
        } else {
            res.json({
                success: true,
                message: 'Contest started',
                started: true,
                startTime: contest.startTime,
                endTime: contest.endTime
            })
        }
    } catch (error) {
        next(error)
    }
}
// Controller to get contest
export const getContest = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const contest = await Contest.findOne({})
        if (contest == null) {
            res.json({ success: false, message: 'Contest not found' })
        } else {
            res.json({
                success: true,
                contest
            })
        }
    } catch (error) {
        next(error)
    }
}

// Create a new contest
export const createContest = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {
            name,
            questionOrder,
            startTime,
            endTime,
            allowRegistration,
            allowQuestionModify,
            allowQuestionUpload
        } = req.body

        const savedContest = await Contest.findOneAndUpdate(
            {},
            {
                name,
                questionOrder,
                startTime,
                endTime,
                allowRegistration,
                allowQuestionModify,
                allowQuestionUpload
            },
            { new: true, upsert: true }
        )
        res.status(201).json({ success: true, contest: savedContest })
    } catch (error) {
        next(error)
    }
}

// Update an existing contest
export const updateContest = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params

        const updatedContest = await Contest.findByIdAndUpdate(id, req.body, {
            new: true,
            upsert: true
        })

        if (updatedContest == null) {
            res.status(404).json({ error: 'Contest not found' })
            return
        }

        res.json({ success: true, message: 'Contest Updated', updatedContest })
    } catch (error) {
        next(error)
    }
}

// Delete a contest
export const deleteContest = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params

        const deletedContest = await Contest.findByIdAndDelete(id)

        if (deletedContest == null) {
            res.status(404).json({ error: 'Contest not found' })
            return
        }

        res.json({ message: 'Contest deleted successfully' })
    } catch (error) {
        next(error)
    }
}
