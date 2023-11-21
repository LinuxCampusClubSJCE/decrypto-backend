"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkModifiy = exports.deleteQuestion = exports.updateQuestion = exports.getQuestionById = exports.addQuestion = exports.getAllQuestions = exports.getMyQuestion = exports.checkAns = void 0;
const Question_1 = __importDefault(require("../models/Question"));
const Contest_1 = __importDefault(require("../models/Contest"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const config_1 = __importDefault(require("../config/config"));
// Controller to add a new question
const checkAns = async (req, res, next) => {
    var _a;
    try {
        const { answer } = req.body;
        if (req.user == null || req.user.isAdmin || req.user.isTeam)
            return;
        const questionNum = req.user.solvedQuestions;
        // TODO: start time and end time
        const contest = await Contest_1.default.findOne({});
        const questionId = contest === null || contest === void 0 ? void 0 : contest.questionOrder[questionNum];
        const question = await Question_1.default.findById(questionId);
        const modifyString = (inputString) => {
            const modifiedString = inputString.replace(/\s+/g, '').toLowerCase();
            return modifiedString;
        };
        if (modifyString(answer) === (question === null || question === void 0 ? void 0 : question.answer)) {
            req.user.solvedQuestions++;
            req.user.lastSolvedTime = moment_timezone_1.default.tz('Asia/Kolkata').toDate();
            await ((_a = req.user) === null || _a === void 0 ? void 0 : _a.save());
            res.status(201).json({
                success: true,
                message: 'Question added successfully'
            });
        }
        else {
            res.status(201).json({ success: false, message: 'Incorrect' });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.checkAns = checkAns;
// Controller to add a new question
const getMyQuestion = async (req, res, next) => {
    var _a;
    try {
        if (req.user == null || req.user.isAdmin || req.user.isTeam)
            return;
        const currentTime = (0, moment_timezone_1.default)().tz('Asia/Kolkata'); // Get current time in IST
        const questionNum = req.user.solvedQuestions;
        // Convert contest start and end times to moment objects in IST
        const contest = await Contest_1.default.findOne({});
        if (contest == null || contest.questionOrder.length === 0) {
            res.json({ success: false, message: 'Contest not found' });
            return;
        }
        const startTime = (0, moment_timezone_1.default)(contest.startTime).tz('Asia/Kolkata');
        const endTime = (0, moment_timezone_1.default)(contest.endTime).tz('Asia/Kolkata');
        // Check if current time is within the contest duration
        if (!currentTime.isBetween(startTime, endTime, 'minute', '[]')) {
            res.json({
                success: false,
                message: 'Contest Not started',
                started: false,
                startTime: contest.startTime,
                endTime: contest.endTime
            });
            return;
        }
        if (contest != null &&
            contest.questionOrder.length === ((_a = req.user) === null || _a === void 0 ? void 0 : _a.solvedQuestions)) {
            res.status(201).json({
                success: true,
                message: 'You have completed all the questions 🔥',
                completed: true
            });
            return;
        }
        const questionId = contest === null || contest === void 0 ? void 0 : contest.questionOrder[questionNum + 1];
        const question = await Question_1.default.findById(questionId).select('image hint');
        res.status(201).json({
            success: true,
            started: true,
            completed: false,
            question
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyQuestion = getMyQuestion;
// Controller to get all questions
const getAllQuestions = async (req, res, next) => {
    var _a, _b;
    try {
        if (req.user != null && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
            const questions = await Question_1.default.find();
            res.json({ success: true, questions });
        }
        else {
            const questions = await Question_1.default.find({ creator: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id });
            res.json({ success: true, questions });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getAllQuestions = getAllQuestions;
// Controller to add a new question
const addQuestion = async (req, res, next) => {
    try {
        const { image, answer, hint, difficulty } = req.body;
        if (req.user == null)
            return;
        const newQuestion = new Question_1.default({
            image,
            answer,
            hint,
            difficulty,
            creator: req.user._id
        });
        await newQuestion.save();
        res.status(201).json({
            success: true,
            message: 'Question added successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addQuestion = addQuestion;
// Controller to get a question by ID
const getQuestionById = async (req, res, next) => {
    try {
        const question = await Question_1.default.findById(req.params.id);
        if (question == null) {
            res.status(404).json({
                success: false,
                message: 'Question not found'
            });
            return;
        }
        res.json({ success: true, question });
    }
    catch (error) {
        next(error);
    }
};
exports.getQuestionById = getQuestionById;
// Controller to update a question by ID
const updateQuestion = async (req, res, next) => {
    try {
        if (!config_1.default.ALLOW_QUESTION_UPDATE) {
            res.json({
                success: false,
                message: 'Contest Started. Cannot Update. Ask Admin'
            });
            return;
        }
        await Question_1.default.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Question updated successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateQuestion = updateQuestion;
// Controller to delete a question by ID
const deleteQuestion = async (req, res, next) => {
    try {
        if (!config_1.default.ALLOW_QUESTION_UPDATE) {
            res.json({
                success: false,
                message: 'Contest Started. Cannot Delete. Ask Admin'
            });
            return;
        }
        await Question_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteQuestion = deleteQuestion;
const checkModifiy = async (req, res) => {
    res.json({ success: true, allowed: config_1.default.ALLOW_QUESTION_UPDATE });
};
exports.checkModifiy = checkModifiy;
