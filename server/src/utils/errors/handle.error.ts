import { Response, NextFunction } from "express";
import { ClientSession } from 'mongoose';


export const logError = (message: string, error: any) => {
    console.error(message, error);
};

export const handleValidationError = (error: any, res: Response): boolean => {
    if (error) {
        res.status(400).json({ success: false, message: error.details[0].message });
        return true;
    }
    return false;
};

export const handleTransactionError = async (session: ClientSession, message: string, error: any) => {
    console.error(message, error);
    await session.abortTransaction();
};

export const handleServiceResult = (result: any, res: Response, notFoundMessage: string): boolean => {
    if (!result) {
        res.status(404).json({ success: false, message: notFoundMessage });
        return true;
    }
    return false;
};

/**
 * Handle errors from service layer, send appropriate response, and call next() if needed
 * @param error - The error object or message
 * @param res - The Express Response object
 * @param next - The NextFunction to pass the error to the next middleware
 * @param message - Custom error message (optional)
 */
export const handleServiceError = (error: any, res: Response, next: NextFunction, message: string = "Internal Server Error"): void => {
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