"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTeam = exports.checkAdmin = exports.checkToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const User_1 = __importDefault(require("../models/User"));
const checkToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    if (token == null) {
        res.status(401).json({ success: false, message: 'Please Login' });
        return;
    }
    jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET, async (err, data) => {
        if (err != null) {
            res.status(403).json({
                success: false,
                message: 'Please Login'
            });
            return;
        }
        const user = await User_1.default.findById(data.userId);
        if (user !== null) {
            req.user = user;
            next();
        }
        else {
            res.status(403).json({
                success: false,
                message: 'Please Login'
            });
        }
    });
};
exports.checkToken = checkToken;
const checkAdmin = (req, res, next) => {
    var _a;
    if (req.user != null && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
        next();
    }
    else {
        res.status(401).json({ success: false, message: 'You are not Admin' });
    }
};
exports.checkAdmin = checkAdmin;
const checkTeam = (req, res, next) => {
    var _a, _b;
    if (req.user != null && (((_a = req.user) === null || _a === void 0 ? void 0 : _a.isTeam) || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.isAdmin))) {
        next();
    }
    else {
        res.status(401).json({
            success: false,
            message: 'You are not member of LCC'
        });
    }
};
exports.checkTeam = checkTeam;
