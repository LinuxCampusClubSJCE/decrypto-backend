import express from 'express'
import {
    getAllQuestions,
    addQuestion,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    checkAns,
    getMyQuestion,
    checkModifiy,
    checkAnswerExist,
    getCount,
    getCategoryCount
} from '../controllers/questionController'
import { checkAdmin, checkTeam } from '../middleware/authMiddleware'

const router = express.Router()

router.post('/ans', checkAns) // Route to add a new question
router.get('/my', getMyQuestion) // Route get solving question

router.get('/count', checkAdmin, getCount) // Route to get all questions
router.get('/categorycount', checkAdmin, getCategoryCount) // Route to get all questions
router.get('/modifyallowed', checkTeam, checkModifiy) // Route check modification allowed or not
router.post('/add', checkTeam, addQuestion) // Route to add a new question
router.put('/:id', checkTeam, updateQuestion) // Route to update a question by ID
router.delete('/:id', checkTeam, deleteQuestion) // Route to delete a question by ID
router.get('/:id', checkTeam, getQuestionById) // Route to get a question by ID
router.get('/', checkTeam, getAllQuestions) // Route to get all questions
router.get('/exist/:answer', checkTeam, checkAnswerExist) // Route to get all questions

export default router
