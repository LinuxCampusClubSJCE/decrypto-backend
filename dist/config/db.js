"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const config_js_1 = __importDefault(require("./config.js"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(config_js_1.default.MONGODB_URI);
        console.log('MongoDB connected');
    }
    catch (error) {
        if (error instanceof mongodb_1.MongoError) {
            console.error('Error connecting to MongoDB:', error.message);
        }
        process.exit(1);
    }
};
exports.default = connectDB;
