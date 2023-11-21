"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContest = exports.updateContest = exports.createContest = exports.getContest = exports.getDetails = void 0;
const Contest_1 = __importDefault(require("../models/Contest")); // Import the Contest model
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// Controller to add a new contest
const getDetails = async (req, res, next) => {
    try {
        const currentTime = (0, moment_timezone_1.default)().tz('Asia/Kolkata'); // Get current time in IST
        const contest = await Contest_1.default.findOne({});
        if (contest == null) {
            res.json({ success: false, message: 'Contest not found' });
            return;
        }
        const startTime = (0, moment_timezone_1.default)(contest.startTime).tz('Asia/Kolkata');
        const endTime = (0, moment_timezone_1.default)(contest.endTime).tz('Asia/Kolkata');
        // Check if current time is within the contest duration
        if (!currentTime.isBetween(startTime, endTime, 'minute', '[]')) {
            res.json({
                success: true,
                message: 'Contest Not started',
                started: false,
                startTime: contest.startTime,
                endTime: contest.endTime
            });
        }
        else {
            res.json({
                success: true,
                message: 'Contest started',
                started: true,
                startTime: contest.startTime,
                endTime: contest.endTime
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getDetails = getDetails;
// Controller to get contest
const getContest = async (req, res, next) => {
    try {
        const contest = await Contest_1.default.findOne({});
        if (contest == null) {
            res.json({ success: false, message: 'Contest not found' });
        }
        else {
            res.json({
                success: true,
                contest
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getContest = getContest;
// Create a new contest
const createContest = async (req, res, next) => {
    try {
        const { name, questionOrder, startTime, endTime } = req.body;
        const savedContest = await Contest_1.default.findOneAndUpdate({}, { name, questionOrder, startTime, endTime }, { new: true, upsert: true });
        res.status(201).json({ success: true, contest: savedContest });
    }
    catch (error) {
        next(error);
    }
};
exports.createContest = createContest;
// Update an existing contest
const updateContest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, questionOrder, startTime, endTime } = req.body;
        const updatedContest = await Contest_1.default.findByIdAndUpdate(id, { name, questionOrder, startTime, endTime }, { new: true, upsert: true });
        if (updatedContest == null) {
            res.status(404).json({ error: 'Contest not found' });
            return;
        }
        res.json({ success: true, message: 'Contest Updated', updatedContest });
    }
    catch (error) {
        next(error);
    }
};
exports.updateContest = updateContest;
// Delete a contest
const deleteContest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedContest = await Contest_1.default.findByIdAndDelete(id);
        if (deletedContest == null) {
            res.status(404).json({ error: 'Contest not found' });
            return;
        }
        res.json({ message: 'Contest deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteContest = deleteContest;
