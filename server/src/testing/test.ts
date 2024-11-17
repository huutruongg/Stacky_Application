import axios from "axios";
import { log } from "console";

// Define types for the response data
interface Contributor {
  login: string;
  contributions: number;
}

const getAllRepos = async (token: string): Promise<{ url: string; language: string }[]> => {
  const headers = {
    Authorization: `token ${token}`,
  };

  const repos: { url: string; language: string }[] = [];
  let page = 1;
  const perPage = 100; // GitHub API supports pagination with a max of 100 items per page

  try {
    while (true) {
      // Fetch repositories (including private and collaboration repos)
      const response = await axios.get(
        `https://api.github.com/user/repos?per_page=${perPage}&page=${page}`,
        { headers }
      );

      const repoData = response.data;

      // If no more repos, exit the loop
      if (repoData.length === 0) break;

      // Add repo URL and language to the array
      repoData.forEach((repo: any) => {
        repos.push({ url: repo.url, language: repo.language || "Unknown" });
      });

      page++;
    }
  } catch (error: any) {
    console.error("Failed to fetch repositories:", error.message);
  }

  return repos;
};

const calculateGitHubScore = async (
  repos: { url: string; language: string }[],
  JD_languages: string[],
  token: string
): Promise<number> => {
  const headers = {
    Authorization: `token ${token}`,
  };

  // Fetch the username from GitHub API
  const userResponse = await axios.get("https://api.github.com/user", { headers });
  const username = userResponse.data.login;

  let totalContributionPercentage = 0; // Tổng phần trăm đóng góp của user
  let validRepoCount = 0; // Số repository hợp lệ (trong JD_languages)

  // Filter repos by JD_languages
  const filteredRepos = repos.filter((repo) => JD_languages.includes(repo.language));

  for (const repo of filteredRepos) {
    try {
      // Get contributors data from each repo
      const response = await axios.get<Contributor[]>(`${repo.url}/contributors`, { headers });
      const contributors = response.data;

      // Calculate total contributions in the repo
      const totalContributions = contributors.reduce((sum, contributor) => sum + contributor.contributions, 0);

      log("totalContributions", {
        repoUrl: repo.url,
        totalContributions,
        language: repo.language,
      });

      // Find contributions for the authenticated user
      const userContributions = contributors.find((contributor) => contributor.login === username)?.contributions || 0;

      if (totalContributions > 0) {
        // Calculate the user's contribution percentage for this repo
        const contributionPercentage = (userContributions / totalContributions) * 100;

        // Accumulate the contribution percentage
        totalContributionPercentage += contributionPercentage;
        validRepoCount++;
      }
    } catch (error: any) {
      console.error(`Failed to fetch contributors for repo: ${repo.url}`, error.message);
    }
  }
  log("totalContributionPercentage", totalContributionPercentage);
  log("validRepoCount", validRepoCount);
  // Calculate the average contribution percentage across all valid repositories
  const averageContributionPercentage = validRepoCount > 0 ? totalContributionPercentage / validRepoCount : 0;

  // Cap the score at 100
  return Math.min(averageContributionPercentage, 100);
};


// Example usage
(async () => {
  const token = "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"; // Replace with your actual token
  const JD_languages = ['Python', 'Java', 'C++', 'C#', 'Ruby', 'Go', 'Swift', 'Kotlin'];

  // Get all repos with their languages
  const repos = await getAllRepos(token);

  // Calculate score for the authenticated user based on filtered languages
  const score = await calculateGitHubScore(repos, JD_languages, token);
  console.log("GitHub Score:", score);
})();
