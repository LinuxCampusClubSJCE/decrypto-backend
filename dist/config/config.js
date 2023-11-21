"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envVariables = {
    MONGODB_URI: process.env.MONGODB_URI.length > 0
        ? process.env.MONGODB_URI
        : 'mongodb://localhost:27017/decrypto',
    PORT: process.env.PORT !== 0 ? process.env.PORT : 3000,
    JWT_SECRET: process.env.JWT_SECRET !== '' ? process.env.JWT_SECRET : 'secret',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME !== ''
        ? process.env.ADMIN_USERNAME
        : 'admin',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD !== ''
        ? process.env.ADMIN_PASSWORD
        : 'Admin@123',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL !== ''
        ? process.env.ADMIN_EMAIL
        : 'lccsjce@sjce.ac.in',
    ADMIN_FULLNAME: process.env.ADMIN_FULLNAME !== ''
        ? process.env.ADMIN_FULLNAME
        : 'LCC Admin',
    ADMIN_USN: process.env.ADMIN_USN !== '' ? process.env.ADMIN_USN : '01JST00CS000',
    ALLOW_QUESTION_UPDATE: process.env.ALLOW_QUESTION_UPDATE === 'true',
    ALLOW_USER_REGISTRATION: process.env.ALLOW_USER_REGISTRATION === 'true'
};
exports.default = envVariables;
