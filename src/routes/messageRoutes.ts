import express from 'express'
import { checkAdmin, checkToken } from '../middleware/authMiddleware'
import {
    deleteAllMessages,
    getAllMessages,
    sendMsg
} from '../controllers/messageController'

const router = express.Router()

router.post('/send', checkToken, sendMsg)
router.get('/all', checkToken, checkAdmin, getAllMessages)
router.delete('/all', checkToken, checkAdmin, deleteAllMessages)

export default router
