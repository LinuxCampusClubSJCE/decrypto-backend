import express from 'express'
import {
    getAllUsers,
    deleteUser,
    updateUser,
    getLeaderboard,
    getUserById,
    getTeamLeaderboard
} from '../controllers/userController' // Import user controller methods
import { checkAdmin, checkToken } from '../middleware/authMiddleware'

const router = express.Router()

router.get('/leaderboard', getLeaderboard)
router.get('/teamleaderboard', getTeamLeaderboard)
router.get('/:id', checkToken, getUserById)
router.delete('/:id', checkToken, checkAdmin, deleteUser)
router.put('/:id', checkToken, updateUser)
router.get('/', checkToken, checkAdmin, getAllUsers)

export default router
