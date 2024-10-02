export class DuplicateApplicationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DuplicateApplicationError';
    }
}