"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User")); // Assuming IUser is the User model interface
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User_1.default.find(); // Assuming User is the Mongoose model
        res.json({ success: true, users });
    }
    catch (error) {
        next(error);
    }
    // No explicit return here, allowing the function to implicitly return void
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id; // Assuming user ID is passed as a parameter
        const user = await User_1.default.findById(userId); // Assuming User is the Mongoose model
        if (user != null) {
            res.json({ success: true, user });
        }
        else {
            res.status(400).json({ success: false, message: 'User not found' });
        }
    }
    catch (error) {
        next(error);
    }
    // No explicit return here, allowing the function to implicitly return void
};
exports.getUserById = getUserById;
const updateUser = async (req, res, next) => {
    const userId = req.params.id; // Assuming user ID is passed as a parameter
    const updatedUserData = req.body; // Data to update, received in request body
    try {
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, updatedUserData, { new: true });
        if (updatedUser != null) {
            res.status(404).json({ success: true, message: 'User not found' });
            return;
        }
        res.json(updatedUser);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    const userId = req.params.id; // Assuming user ID is passed as a parameter
    try {
        const deletedUser = await User_1.default.findByIdAndDelete(userId);
        if (deletedUser == null) {
            res.status(404).send({ success: false, meesage: 'User not found' });
            return;
        }
        res.json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
const getLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await User_1.default.find({ isAdmin: false, isTeam: false }, 'username solvedQuestions')
            .sort({ solvedQuestions: -1, lastSolvedTime: 1 }) // Sort by solvedQuestions descending, lastSolvedTime ascending
            .exec();
        res.json({ success: true, leaderboard });
    }
    catch (error) {
        next(error);
    }
};
exports.getLeaderboard = getLeaderboard;
