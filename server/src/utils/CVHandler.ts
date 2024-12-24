import { ICertification } from "../interfaces/ICertification";
import { IEducation } from "../interfaces/IEducation";
import { ILanguage } from "../interfaces/ILanguage";

export const transformCV = (cv: { educations?: IEducation[], languages?: ILanguage[], certifications?: ICertification[] }) => {
    const transformArray = (arr: any[], key1: string, key2: string) => 
        arr.map(item => `${item[key1]}, ${item[key2]}`);

    return {
        educations: cv.educations ? transformArray(cv.educations, 'schoolName', 'fieldName') : undefined,
        languages: cv.languages ? transformArray(cv.languages, 'language', 'level') : undefined,
        certifications: cv.certifications ? transformArray(cv.certifications, 'certificateName', 'certificateDetail') : undefined
    };
};

export const scaleScore = (rawScore: number, maxScale: number): number => {
    const roundedScore = Math.round(rawScore); // Round to the nearest integer
    return Math.min(maxScale, Math.max(0, Math.floor((roundedScore / 100) * maxScale))); // Scale and clamp within range
};
