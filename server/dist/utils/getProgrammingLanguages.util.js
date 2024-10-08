"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
};
const getMatchingLanguages = (candidateLanguages, jdText) => {
    // Find languages in the job description
    return candidateLanguages.filter(language => new RegExp(`\\b${escapeRegExp(language)}\\b`, 'i').test(jdText));
};
exports.default = getMatchingLanguages;
