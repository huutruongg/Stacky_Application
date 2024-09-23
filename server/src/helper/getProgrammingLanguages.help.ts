const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
};

const getMatchingLanguages = (candidateLanguages: string[], jdText: string): string[] => {
    // Find languages in the job description
    return candidateLanguages.filter(language => 
        new RegExp(`\\b${escapeRegExp(language)}\\b`, 'i').test(jdText)
    );
};

export default getMatchingLanguages;
