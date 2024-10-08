"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateApplicationError = void 0;
class DuplicateApplicationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DuplicateApplicationError';
    }
}
exports.DuplicateApplicationError = DuplicateApplicationError;
