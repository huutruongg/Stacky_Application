import { ICertification } from "../interfaces/ICertification";
import { IEducation } from "../interfaces/IEducation";
import { ILanguage } from "../interfaces/ILanguage";

export function transformCV(cv: { educations?: IEducation[], languages?: ILanguage[], certifications?: ICertification[] }) {
    const transformedCV: { educations?: string[], languages?: string[], certifications?: string[] } = {};

    // Transform educations
    if (Array.isArray(cv.educations)) {
        transformedCV.educations = cv.educations.map(
            (edu: { schoolName: string, fieldName: string }) => `${edu.schoolName}, ${edu.fieldName}`
        );
    }

    // Transform languages
    if (Array.isArray(cv.languages)) {
        transformedCV.languages = cv.languages.map(
            (lang: { language: string, level: string }) => `${lang.language}, ${lang.level}`
        );
    }

    // Transform certifications
    if (Array.isArray(cv.certifications)) {
        transformedCV.certifications = cv.certifications.map(
            (cert: { certificateName: string, certificateDetail: string }) => `${cert.certificateName}, ${cert.certificateDetail}`
        );
    }

    return transformedCV;
}

export function scaleScore(rawScore: number, maxScale: number): number {
    const roundedScore = Math.round(rawScore); // Round to the nearest integer
    return Math.min(maxScale, Math.max(0, Math.floor((roundedScore / 100) * maxScale))); // Scale and clamp within range
}