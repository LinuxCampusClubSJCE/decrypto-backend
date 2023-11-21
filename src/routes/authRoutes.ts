import express from 'express'
import {
    registerUser,
    loginUser,
    registerTeam,
    checkLogin,
    checkRegistration
} from '../controllers/authController'
import { checkAdmin, checkToken } from '../middleware/authMiddleware'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user
 *     description: Login with username/email and password to obtain access token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '200':
 *         description: Successful login, returns access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       '400':
 *         description: Invalid credentials provided.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with full name, email, username, and password.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - fullName
 *               - email
 *               - username
 *               - password
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *       '400':
 *         description: Invalid registration data provided.
 *       '500':
 *         description: Internal server error.
 */

router.post('/register', registerUser)
router.get('/registerstarted', checkRegistration)
router.post('/registerTeam', checkToken, checkAdmin, registerTeam)
router.post('/login', loginUser)
router.get('/check', checkToken, checkLogin)

export default router
