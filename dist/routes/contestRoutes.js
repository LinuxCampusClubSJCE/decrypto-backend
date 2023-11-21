"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contestController_1 = require("../controllers/contestController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Route to create a new contest
router.get('/details', contestController_1.getDetails);
router.post('/create', authMiddleware_1.checkToken, authMiddleware_1.checkAdmin, contestController_1.createContest);
router.get('/', authMiddleware_1.checkToken, authMiddleware_1.checkAdmin, contestController_1.getContest);
// Route to update an existing contest
router.put('/update/:id', authMiddleware_1.checkToken, authMiddleware_1.checkAdmin, contestController_1.updateContest);
// Route to delete a contest
router.delete('/delete/:id', authMiddleware_1.checkToken, authMiddleware_1.checkAdmin, contestController_1.deleteContest);
exports.default = router;
