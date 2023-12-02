import { type NextFunction, type Request, type Response } from 'express'
import Question, { type IQuestion } from '../models/Question'
import Contest from '../models/Contest'
import moment from 'moment-timezone'
import { Md5 } from 'ts-md5'
import User from '../models/User'
const modifyString = (inputString: string): string => {
    const modifiedString = inputString.replace(/\s+/g, '').toLowerCase()
    return modifiedString
}
// Controller to add a new question
export const checkAns = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { answer, rate, avgAttempts } = req.body
        if (req.user == null) return
        const questionNum = req.user.solvedQuestions
        const contest = await Contest.findOne({})
        const questionId = contest?.questionOrder[questionNum]

        const question = await Question.findById(questionId)

        if (
            question !== null &&
            modifyString(answer) === modifyString(question?.answer ?? ' ')
        ) {
            req.user.solvedQuestions++
            req.user.lastSolvedTime = moment.tz('Asia/Kolkata').toDate()
            if (req.user.attempts === undefined) {
                req.user.attempts = []
            }
            if (question.rateCount === 0) {
                if (req.user.firstToCrack === undefined) {
                    req.user.firstToCrack = []
                }
                req.user.firstToCrack.push(question._id)
            }
            req.user.attempts.push(Number(avgAttempts))
            await req.user?.save()
            res.status(201).json({
                success: true,
                message: 'Your Answer is correct'
            })
            if (!req.user.isTeam) {
                question.rateCount++
                question.rating = (rate + question.rating) / question.rateCount
                question.avgAttempts =
                    (Number(avgAttempts) + question.avgAttempts) /
                    question.rateCount
                await question.save()
            }
        } else {
            res.status(201).json({
                success: false,
                message: 'Incorrect Answer'
            })
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
        if (req.user == null) return
        const currentTime = moment().tz('Asia/Kolkata') // Get current time in IST

        const questionNum = req.user.solvedQuestions
        // Convert contest start and end times to moment objects in IST
        const contest = await Contest.findOne({})
        if (contest == null) {
            res.json({ success: false, message: 'Contest not found' })
            return
        }
        const startTime = moment(contest.startTime).tz('Asia/Kolkata')
        const endTime = moment(contest.endTime).tz('Asia/Kolkata')
        // Check if current time is within the contest duration
        if (
            contest.forceState !== 'start' &&
            (contest.forceState === 'stop' ||
                !currentTime.isBetween(startTime, endTime, 'minute', '[]'))
        ) {
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
        const questionId = contest?.questionOrder[questionNum]
        const question = await Question.findById(questionId)
            .select('image hint answer showedHint rating rateCount avgAttempts')
            .populate('creator', 'codeName')
            .lean()
        if (question != null) {
            res.status(201).json({
                success: true,
                started: true,
                completed: false,
                question: {
                    ...question,
                    no: questionNum + 1,
                    answer: Md5.hashStr(modifyString(question.answer))
                }
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
            const questions = await Question.find().populate(
                'creator',
                'fullName username'
            )
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
        const { image, answer, hint, difficulty, category } = req.body
        if (req.user == null) return
        const newQuestion: IQuestion = new Question({
            image,
            answer,
            modifiedAnswer: modifyString(answer),
            hint,
            difficulty,
            category,
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
        const contest = await Contest.findOne({})
        let allowed = true
        if (contest !== null && !contest.allowQuestionModify) {
            allowed = false
        }
        if (!allowed && req.user !== undefined && !req.user.isAdmin) {
            res.json({
                success: false,
                message: 'Contest Started. Cannot Update. Ask Admin'
            })
            return
        }
        if (req.user !== undefined && !req.user.isAdmin) {
            delete req.body.avgAttempts
            delete req.body.rating
            delete req.body.showedHint
            delete req.body.avgAttempts
            delete req.body.rateCount
        }
        req.body.updatedDate = moment.tz('Asia/Kolkata').toDate()
        if (req.body.answer !== undefined) {
            req.body.modifiedAnswer = modifyString(req.body.answer)
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
        const contest = await Contest.findOne({})
        let allowed = true
        if (contest !== null && !contest.allowQuestionModify) {
            allowed = false
        }
        if (!allowed && req.user !== undefined && !req.user.isAdmin) {
            res.json({
                success: false,
                message: 'Contest Started. Cannot Delete. Ask Admin'
            })
            return
        }
        if (req.user !== undefined && req.user.isAdmin) {
            await Question.findByIdAndDelete(req.params.id)
        } else {
            const question = await Question.findOneAndDelete({
                _id: req.params.id,
                creator: req.user?._id
            })
            if (question === null) {
                res.status(404).json({
                    success: false,
                    message: 'Question not found'
                })
                return
            }
        }
        if (contest !== null) {
            contest.questionOrder = contest.questionOrder.filter(
                (q) => q._id.toString() !== req.params.id
            )
            await contest.save()
        }
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
    const contest = await Contest.findOne({})
    let allowed = true
    if (contest !== null && !contest.allowQuestionModify) {
        allowed = false
    }
    res.json({ success: true, allowed })
}

export const checkAnswerExist = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { answer } = req.params
    const question = await Question.findOne({ modifiedAnswer: answer })
    res.json({ success: true, exist: question !== null })
}

export const getCount = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        console.log('running')
        const usersWithQuestions = await User.aggregate([
            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
                    foreignField: 'creator',
                    as: 'questionsAdded'
                }
            },
            {
                $match: {
                    questionsAdded: { $exists: true, $ne: [] } // Only select users who added questions
                }
            },
            {
                $project: {
                    fullName: 1,
                    questionCount: { $size: '$questionsAdded' } // Count of questions added by each user
                }
            },
            {
                $sort: { questionCount: -1 } // Sort users by the count of questions added
            }
        ])
        res.json({ success: true, users: usersWithQuestions })
    } catch (err) {
        next(err)
    }
}

export const getCategoryCount = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        console.log('running')
        const categoryCounts = await Question.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ])
        res.json({ success: true, categoryCounts })
    } catch (err) {
        next(err)
    }
}
