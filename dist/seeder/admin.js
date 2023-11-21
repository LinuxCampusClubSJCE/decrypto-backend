"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const User_1 = __importDefault(require("../models/User")); // Assuming this is your User model
const bcrypt_1 = __importDefault(require("bcrypt"));
const createAdminUser = async () => {
    try {
        const adminUsername = config_1.default.ADMIN_USERNAME;
        const adminPassword = config_1.default.ADMIN_PASSWORD;
        const adminEmail = config_1.default.ADMIN_EMAIL;
        const adminFullName = config_1.default.ADMIN_FULLNAME;
        const adminUSN = config_1.default.ADMIN_USN;
        const existingAdmin = await User_1.default.findOne({ username: adminUsername });
        if (existingAdmin != null) {
            console.log('Admin user already exists.');
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(adminPassword, 10);
        const adminUser = new User_1.default({
            username: adminUsername,
            password: hashedPassword,
            email: adminEmail,
            fullName: adminFullName,
            usn: adminUSN,
            isAdmin: true
        });
        await adminUser.save();
        console.log('Admin user created successfully.');
    }
    catch (error) {
        console.error('Error creating admin user:', error);
    }
};
exports.default = createAdminUser;
