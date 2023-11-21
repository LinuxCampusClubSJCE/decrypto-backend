"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const config_1 = __importDefault(require("./config/config"));
const swagger_1 = __importDefault(require("./routes/swagger"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes")); // Import your authentication routes
const express_rate_limit_1 = require("express-rate-limit");
const userRoutes_1 = __importDefault(require("./routes/userRoutes")); // Import your user routes
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes")); // Import your user routes
const authMiddleware_1 = require("./middleware/authMiddleware");
const admin_1 = __importDefault(require("./seeder/admin"));
const contestRoutes_1 = __importDefault(require("./routes/contestRoutes"));
const mongooseError_1 = __importDefault(require("./middleware/mongooseError"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = config_1.default.PORT;
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 1 * 60 * 1000,
    limit: 1000,
    standardHeaders: 'draft-7',
    legacyHeaders: false
});
(0, db_1.default)().catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
});
void (0, admin_1.default)();
app.use((0, cors_1.default)({
    origin: '*'
}));
app.use(limiter);
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({ success: true, message: '✅ Server is Running' });
});
// Define routes
app.use('/api/auth', authRoutes_1.default); // Authentication routes
app.use('/api/users', userRoutes_1.default); // User routes
app.use('/api/question', authMiddleware_1.checkToken, questionRoutes_1.default); // Question routes
app.use('/api/contest', contestRoutes_1.default); // Contest routes
app.use('/api-docs', swagger_1.default);
app.use((err, req, res, next) => {
    (0, mongooseError_1.default)(err, req, res, next);
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
