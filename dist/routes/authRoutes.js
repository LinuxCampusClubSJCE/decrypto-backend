"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
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
router.post('/register', authController_1.registerUser);
router.get('/registerstarted', authController_1.checkRegistration);
router.post('/registerTeam', authMiddleware_1.checkToken, authMiddleware_1.checkAdmin, authController_1.registerTeam);
router.post('/login', authController_1.loginUser);
router.get('/check', authMiddleware_1.checkToken, authController_1.checkLogin);
exports.default = router;
