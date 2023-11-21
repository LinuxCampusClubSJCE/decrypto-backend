"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionController_1 = require("../controllers/questionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/ans', questionController_1.checkAns); // Route to add a new question
router.get('/my', questionController_1.getMyQuestion); // Route get solving question
router.get('/modifyallowed', authMiddleware_1.checkTeam, questionController_1.checkModifiy); // Route check modification allowed or not
router.post('/add', authMiddleware_1.checkTeam, questionController_1.addQuestion); // Route to add a new question
router.put('/:id', authMiddleware_1.checkTeam, questionController_1.updateQuestion); // Route to update a question by ID
router.delete('/:id', authMiddleware_1.checkTeam, questionController_1.deleteQuestion); // Route to delete a question by ID
router.get('/:id', authMiddleware_1.checkTeam, questionController_1.getQuestionById); // Route to get a question by ID
router.get('/', authMiddleware_1.checkTeam, questionController_1.getAllQuestions); // Route to get all questions
exports.default = router;
