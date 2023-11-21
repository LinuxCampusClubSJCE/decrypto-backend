"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRegistration = exports.checkLogin = exports.loginUser = exports.registerTeam = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const config_1 = __importDefault(require("../config/config"));
// Controller for user registration
const registerUser = async (req, res, next) => {
    try {
        console.log(config_1.default.ALLOW_USER_REGISTRATION);
        console.log(typeof config_1.default.ALLOW_USER_REGISTRATION);
        if (!config_1.default.ALLOW_USER_REGISTRATION) {
            res.status(400).json({
                success: false,
                message: 'Registration Not Started'
            });
            return;
        }
        const { fullName, username, email, usn, phone, password } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.default({
            fullName,
            username,
            phone,
            email,
            usn,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
// Controller for LCC Team registration
const registerTeam = async (req, res, next) => {
    try {
        const { fullName, username, email, usn, phone, password, isTeam, isAdmin } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.default({
            fullName,
            username,
            email,
            usn,
            phone,
            password: hashedPassword,
            isTeam,
            isAdmin
        });
        await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User registered successfully'
        });
    }
    catch (error) {
        next(error);
    }
};
exports.registerTeam = registerTeam;
// Controller for user login
const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User_1.default.findOne({
            $or: [{ email: username }, { username }]
        });
        if (user == null) {
            res.status(400).json({
                success: false,
                message: 'Invalid username/password'
            });
            return;
        }
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (validPassword == null) {
            res.status(400).json({
                success: false,
                message: 'Invalid username/password'
            });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.default.JWT_SECRET, {
            expiresIn: '2d'
        });
        res.json({
            success: true,
            message: 'Successfully Logged in',
            accessToken,
            user
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
const checkLogin = async (req, res) => {
    res.json({ success: true });
};
exports.checkLogin = checkLogin;
const checkRegistration = async (req, res) => {
    res.json({ success: true, started: config_1.default.ALLOW_USER_REGISTRATION });
};
exports.checkRegistration = checkRegistration;
