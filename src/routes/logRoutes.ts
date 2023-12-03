import express from 'express'
import { checkAdmin, checkToken } from '../middleware/authMiddleware'
import { getAllLogs, deleteAllLogs } from '../controllers/logController'

const router = express.Router()
router.get('/all', checkToken, checkAdmin, getAllLogs)
router.delete('/all', checkToken, checkAdmin, deleteAllLogs)

export default router
