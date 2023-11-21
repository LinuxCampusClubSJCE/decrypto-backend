"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        lowercase: true,
        trim: true,
        minLength: [4, 'Username should be at least 4 characters'],
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    usn: {
        type: String,
        unique: true,
        required: [true, 'USN is required'],
        trim: true,
        uppercase: true,
        minLength: [11, 'USN should be at least 11 characters'],
        maxLength: [14, 'USN should not exceed 14 characters']
    },
    phone: { type: String, required: [true, 'Phone number is required'] },
    solvedQuestions: { type: Number, default: 0 },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password should be at least 8 characters'],
        maxLength: [64, 'Password should not exceed 64 characters']
    },
    isAdmin: { type: Boolean, default: false },
    isTeam: { type: Boolean, default: false },
    createdDate: { type: Date, default: moment_timezone_1.default.tz('Asia/Kolkata').toDate() },
    lastSolvedTime: { type: Date, default: 0 }
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
