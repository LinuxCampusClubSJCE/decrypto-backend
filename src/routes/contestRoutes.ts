import express from 'express'
import {
    createContest,
    updateContest,
    deleteContest,
    getDetails,
    getContest
} from '../controllers/contestController'
import { checkAdmin, checkToken } from '../middleware/authMiddleware'

const router = express.Router()

// Route to create a new contest
router.get('/details', getDetails)

router.post('/create', checkToken, checkAdmin, createContest)
router.get('/', checkToken, checkAdmin, getContest)

// Route to update an existing contest
router.put('/update/:id', checkToken, checkAdmin, updateContest)

// Route to delete a contest
router.delete('/delete/:id', checkToken, checkAdmin, deleteContest)

export default router
