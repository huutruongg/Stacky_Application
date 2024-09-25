"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const email_routes_1 = __importDefault(require("./routes/email.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const github_routes_1 = __importDefault(require("./routes/github.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const recruiter_routes_1 = __importDefault(require("./routes/recruiter.routes"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const console_1 = require("console");
const uuid_1 = require("uuid");
require("./config/passport-setup");
dotenv_1.default.config();
const corsOptions = {
    origin: process.env.URL_CLIENT,
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
app.use('/user', user_routes_1.default);
app.use('/github', github_routes_1.default);
app.use('/upload', upload_routes_1.default);
app.use('/recruiter', recruiter_routes_1.default);
app.get('/home', (req, res) => {
    res.send("Welcome to Stacky application!");
});
app.listen(port, () => {
    (0, console_1.log)(`[server]: Server is running at http://localhost:${port}`);
    (0, console_1.log)((0, uuid_1.v4)());
});
