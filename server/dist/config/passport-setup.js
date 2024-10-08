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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github_1 = require("passport-github");
const axios_1 = __importDefault(require("axios"));
const console_1 = require("console");
const candidate_service_1 = __importDefault(require("../modules/Candidate/candidate.service"));
const auth_service_1 = __importDefault(require("../modules/Auth/auth.service"));
const EnumProvider_1 = __importDefault(require("../types/EnumProvider"));
const handleUserOAuth = (provider, providerId, email, displayName, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.default.getUserByEmail(email);
    (0, console_1.log)(user);
    if (user) {
        yield candidate_service_1.default.updateOauth(provider, providerId, accessToken, String(user._id));
        return user;
    }
    else {
        const newUser = yield auth_service_1.default.createCandidateUser(email, displayName);
        // log(newUser)
        if (!newUser) {
            return;
        }
        yield candidate_service_1.default.updateOauth(provider, providerId, accessToken, newUser._id);
        return newUser;
    }
});
// Configure Google Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email']
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    const email = profile.emails[0].value;
    const provider = EnumProvider_1.default.GOOGLE;
    const providerId = profile.id;
    (0, console_1.log)(email, provider, providerId);
    try {
        const user = yield handleUserOAuth(provider, providerId, email, profile.displayName, accessToken);
        (0, console_1.log)(user);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
})));
// Configure GitHub Strategy
passport_1.default.use(new passport_github_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback',
    scope: ['user:email', 'repo']
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    let email = null;
    const provider = EnumProvider_1.default.GITHUB;
    const providerId = profile.id;
    if (profile.emails && profile.emails[0]) {
        email = profile.emails[0].value;
    }
    else {
        try {
            const response = yield axios_1.default.get('https://api.github.com/user/emails', {
                headers: { Authorization: `token ${accessToken}` }
            });
            const emails = response.data;
            const primaryEmail = emails.find((e) => e.primary) || emails[0];
            email = primaryEmail ? primaryEmail.email : null;
        }
        catch (err) {
            return done(err);
        }
    }
    if (!email) {
        return done(new Error('Cannot retrieve email from GitHub account'));
    }
    try {
        const user = yield handleUserOAuth(provider, providerId, email, profile.displayName, accessToken);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield auth_service_1.default.getUserById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
