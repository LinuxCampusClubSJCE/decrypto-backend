import { type NextFunction, type Request, type Response } from 'express'
import Question, { type IQuestion } from '../models/Question'
import Contest from '../models/Contest'
import moment from 'moment-timezone'
import envVariables from '../config/config'
import { Md5 } from 'ts-md5'

// Controller to add a new question
export const checkAns = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { answer } = req.body
        if (req.user == null || req.user.isAdmin || req.user.isTeam) return
        const questionNum = req.user.solvedQuestions
        // TODO: start time and end time
        const contest = await Contest.findOne({})
        const questionId = contest?.questionOrder[questionNum]

        const question = await Question.findById(questionId)

        const modifyString = (inputString: string): string => {
            const modifiedString = inputString.replace(/\s+/g, '').toLowerCase()
            return modifiedString
        }
        if (modifyString(answer) === question?.answer) {
            req.user.solvedQuestions++
            req.user.lastSolvedTime = moment.tz('Asia/Kolkata').toDate()
            await req.user?.save()
            res.status(201).json({
                success: true,
                message: 'Question added successfully'
            })
        } else {
            res.status(201).json({ success: false, message: 'Incorrect' })
        }
    } catch (error) {
        next(error)
    }
}
// Controller to add a new question
export const getMyQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (req.user == null || req.user.isAdmin || req.user.isTeam) return
        const currentTime = moment().tz('Asia/Kolkata') // Get current time in IST

        const questionNum = req.user.solvedQuestions
        // Convert contest start and end times to moment objects in IST
        const contest = await Contest.findOne({})
        if (contest == null || contest.questionOrder.length === 0) {
            res.json({ success: false, message: 'Contest not found' })
            return
        }
        const startTime = moment(contest.startTime).tz('Asia/Kolkata')
        const endTime = moment(contest.endTime).tz('Asia/Kolkata')
        // Check if current time is within the contest duration
        if (!currentTime.isBetween(startTime, endTime, 'minute', '[]')) {
            res.json({
                success: false,
                message: 'Contest Not started',
                started: false,
                startTime: contest.startTime,
                endTime: contest.endTime
            })
            return
        }
        if (
            contest != null &&
            contest.questionOrder.length === req.user?.solvedQuestions
        ) {
            res.status(201).json({
                success: true,
                message: 'You have completed all the questions 🔥',
                completed: true
            })
            return
        }
        const questionId = contest?.questionOrder[questionNum + 1]
        const question =
            await Question.findById(questionId).select('image hint answer')
        if (question != null) {
            res.status(201).json({
                success: true,
                started: true,
                completed: false,
                question: { ...question, answer: Md5.hashStr(question.answer) }
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Question not found'
            })
        }
    } catch (error) {
        next(error)
    }
}
// Controller to get all questions
export const getAllQuestions = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (req.user != null && req.user?.isAdmin) {
            const questions = await Question.find()
            res.json({ success: true, questions })
        } else {
            const questions = await Question.find({ creator: req.user?._id })
            res.json({ success: true, questions })
        }
    } catch (error) {
        next(error)
    }
}

// Controller to add a new question
export const addQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { image, answer, hint, difficulty } = req.body
        if (req.user == null) return
        const newQuestion: IQuestion = new Question({
            image,
            answer,
            hint,
            difficulty,
            creator: req.user._id
        })
        await newQuestion.save()
        res.status(201).json({
            success: true,
            message: 'Question added successfully'
        })
    } catch (error) {
        next(error)
    }
}

// Controller to get a question by ID
export const getQuestionById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const question = await Question.findById(req.params.id)
        if (question == null) {
            res.status(404).json({
                success: false,
                message: 'Question not found'
            })
            return
        }
        res.json({ success: true, question })
    } catch (error) {
        next(error)
    }
}

// Controller to update a question by ID
export const updateQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!envVariables.ALLOW_QUESTION_UPDATE) {
            res.json({
                success: false,
                message: 'Contest Started. Cannot Update. Ask Admin'
            })
            return
        }
        await Question.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({
            success: true,
            message: 'Question updated successfully'
        })
    } catch (error) {
        next(error)
    }
}

// Controller to delete a question by ID
export const deleteQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!envVariables.ALLOW_QUESTION_UPDATE) {
            res.json({
                success: false,
                message: 'Contest Started. Cannot Delete. Ask Admin'
            })
            return
        }
        await Question.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        })
    } catch (error) {
        next(error)
    }
}
export const checkModifiy = async (
    req: Request,
    res: Response
): Promise<void> => {
    res.json({ success: true, allowed: envVariables.ALLOW_QUESTION_UPDATE })
}
