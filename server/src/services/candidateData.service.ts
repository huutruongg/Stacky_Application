import { C_Project, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CandidateDataService = {
    getUrlReposSharedByCandidateId: async (id: string): Promise<string[] | null> => {
        const projects = await prisma.c_Project.findMany({
            where: { candidate_id: id },
            select: { url_repo: true }
        });

        // Return the extracted urls or null if no projects found
        return projects.length > 0 ? projects.map(p => p.url_repo) : null;
    },

    getAccessTokenGithub: async (id: string): Promise<string | null> => {
        try {
            const { access_token } = await prisma.oauth_Token.findFirst({
                where: {
                    candidate_id: id,
                    provider: "GITHUB"
                },
                select: { access_token: true }
            }) || {}; // Use destructuring to handle the case where data is null

            return access_token || null; // Return access_token or null if it doesn't exist
        } catch (error) {
            console.error("Error fetching GitHub access token:", error);
            return null; // Return null if there's an error
        }
    }
};

export default CandidateDataService;
