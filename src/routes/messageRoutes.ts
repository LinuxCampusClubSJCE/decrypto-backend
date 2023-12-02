import express from 'express'
import { checkToken } from '../middleware/authMiddleware'
import { sendMsg } from '../controllers/messageController'

const router = express.Router()

router.post('/send', checkToken, sendMsg)

export default router
