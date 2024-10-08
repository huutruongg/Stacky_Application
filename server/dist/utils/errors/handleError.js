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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleServiceError = exports.handleServiceResult = exports.handleTransactionError = exports.handleValidationError = exports.logError = void 0;
const logError = (message, error) => {
    console.error(message, error);
};
exports.logError = logError;
const handleValidationError = (error, res) => {
    if (error) {
        res.status(400).json({ success: false, message: error.details[0].message });
        return true;
    }
    return false;
};
exports.handleValidationError = handleValidationError;
const handleTransactionError = (session, message, error) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(message, error);
    yield session.abortTransaction();
});
exports.handleTransactionError = handleTransactionError;
const handleServiceResult = (result, res, notFoundMessage) => {
    if (!result) {
        res.status(404).json({ success: false, message: notFoundMessage });
        return true;
    }
    return false;
};
exports.handleServiceResult = handleServiceResult;
/**
 * Handle errors from service layer, send appropriate response, and call next() if needed
 * @param error - The error object or message
 * @param res - The Express Response object
 * @param next - The NextFunction to pass the error to the next middleware
 * @param message - Custom error message (optional)
 */
const handleServiceError = (error, res, next, message = "Internal Server Error") => {
    // Log the error if it's a server-side error
    console.error(error);
    // Send error response with the message and status code 500
    res.status(500).json({
        success: false,
        message: message
    });
    // Call the next function if it exists (for further error handling, logging, etc.)
    if (next) {
        return next(error);
    }
};
exports.handleServiceError = handleServiceError;
