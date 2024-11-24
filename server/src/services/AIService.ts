import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { log } from "console";
dotenv.config();

export default class AIService {
    private genAI: GoogleGenerativeAI;
    private model: any;
    private generationConfig: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY || "";
        if (!apiKey) {
            throw new Error("Gemini API Key is missing. Please set GEMINI_API_KEY in your environment variables.");
        }

        this.genAI = new GoogleGenerativeAI(apiKey);

        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
        });

        this.generationConfig = {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "text/plain",
        };
    }

    public async parseCV(filePath: string): Promise<object> {
        try {
            // Read the file content
            const fileContent = fs.readFileSync(filePath, "utf-8");

            const prompt = `
                You are a professional assistant that extracts structured information from a CV (resume) provided as a text input. Convert the data into a JSON object conforming to the following schema:

                JSON Schema:
                {
                    fullName: { type: String, required: true },
                    publicEmail: { type: String, required: true },
                    avatarUrl: { type: String, required: true },
                    birthDate: { type: Date },
                    phoneNumber: { type: String },
                    address: { type: String },
                    professionalSkills: { type: String, required: true },
                    linkedinUrl: { type: String },
                    githubUrl: { type: String },
                    personalDescription: { type: String },
                    languages: [{
                        language: { type: String, required: true },
                        level: { type: String, required: true }
                    }],
                    projects: [{
                        projectName: { type: String, required: true },
                        projectTime: { type: String, required: true },
                        urlRepo: { type: String },
                        projectDescription: { type: String }
                    }],
                    educations: [{
                        schoolName: { type: String, required: true },
                        startDate: { type: Date, required: true },
                        finishDate: { type: Date, required: true },
                        fieldName: { type: String, required: true }
                    }],
                    experiences: [{
                        companyName: { type: String },
                        startDate: { type: Date },
                        endDate: { type: Date },
                        jobPosition: { type: String },
                        previousJobDetails: { type: String }
                    }],
                    certifications: [{
                        certificateName: { type: String, required: true },
                        dateOfReceipt: { type: Date, required: true },
                        certificateDetail: { type: String, required: true }
                    }]
                }

                Process this input:
                ${fileContent}

                Output the JSON object following the schema.
            `;

            // Start the chat session
            const chatSession = this.model.startChat({
                generationConfig: this.generationConfig,
                history: [],
            });

            const result = await chatSession.sendMessage(prompt);
            // Remove possible Markdown formatting from the response
            const responseText = result.response.text();
            log(responseText);
            const cleanedResponse = responseText.replace(/```(?:json)?/g, "").trim();

            // Parse and return the JSON
            return JSON.parse(cleanedResponse);
        } catch (error) {
            console.error("Error parsing CV:", error);
            throw new Error("Failed to parse CV");
        } finally {
            // Cleanup the uploaded file
            fs.unlinkSync(filePath);
        }
    }
}
