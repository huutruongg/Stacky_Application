"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const email_routes_1 = __importDefault(require("./routes/email.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const github_routes_1 = __importDefault(require("./routes/github.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const recruiter_routes_1 = __importDefault(require("./routes/recruiter.routes"));
const candidate_routes_1 = __importDefault(require("./routes/candidate.routes"));
const jobManagement_routes_1 = __importDefault(require("./routes/jobManagement.routes"));
const zaloPay_routes_1 = __importDefault(require("./routes/zaloPay.routes"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const console_1 = require("console");
require("./config/passport-setup");
const database_1 = require("./config/database");
dotenv_1.default.config();
const corsOptions = {
    origin: process.env.URL_CLIENT,
    credentials: true,
    optionsSuccessStatus: 200
};
const app = (0, express_1.default)();
const port = Number(process.env.PORT) | 4080;
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Routing flow configuration
app.use('/auth', auth_routes_1.default);
app.use('/email', email_routes_1.default);
app.use('/github', github_routes_1.default);
app.use('/upload', upload_routes_1.default);
app.use('/recruiter', recruiter_routes_1.default);
app.use('/candidate', candidate_routes_1.default);
app.use('/job-posting', jobManagement_routes_1.default);
app.use('/zalo-pay', zaloPay_routes_1.default);
app.get('/home', (req, res) => {
    res.send("Welcome to Stacky application!");
});
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.disconnectDB)();
    process.exit(0);
}));
(0, database_1.connectDB)()
    .then(db => {
    console.log("Database connection established.");
    app.listen(port, () => {
        (0, console_1.log)(`[server]: Server is running at http://localhost:${port}`);
    });
})
    .catch(error => {
    console.error("Failed to connect to the database:", error);
});
