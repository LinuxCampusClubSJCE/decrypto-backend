"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController"); // Import user controller methods
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/leaderboard', userController_1.getLeaderboard);
router.get('/:id', authMiddleware_1.checkToken, authMiddleware_1.checkAdmin, userController_1.getUserById);
router.delete('/:id', authMiddleware_1.checkToken, authMiddleware_1.checkAdmin, userController_1.deleteUser);
router.put('/:id', authMiddleware_1.checkToken, authMiddleware_1.checkAdmin, userController_1.updateUser);
router.get('/', authMiddleware_1.checkToken, authMiddleware_1.checkAdmin, userController_1.getAllUsers);
exports.default = router;
