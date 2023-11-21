"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const handleMongoErrors = (err, req, res, next) => {
    // console.log(err)
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        // Mongoose validation error
        let errors = '';
        for (const field in err.errors) {
            errors += err.errors[field].message;
        }
        res.status(400).json({ success: false, message: errors });
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        // Mongoose cast error
        res.status(400).json({ success: false, message: 'Invalid ID' });
    }
    else {
        // Other Mongoose errors
        res.status(500).json({ message: 'Error with the request' });
    }
};
exports.default = handleMongoErrors;
