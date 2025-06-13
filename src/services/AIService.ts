import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { User, JobApplication, JobAnalysis, LearningPlan } from "../types";

export class AIService {
  private llm: ChatOpenAI | ChatAnthropic;

  constructor() {
    // Initialize with OpenAI by default, easily switchable
    const openAIApiKey = process.env.OPENAI_API_KEY;
    if (!openAIApiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set.");
    }
    this.llm = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.7,
      openAIApiKey,
    });

    // Uncomment to use Anthropic instead
    // this.llm = new ChatAnthropic({
    //   modelName: 'claude-3-sonnet-20240229',
    //   anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    // });
  }

  async analyzeJobMatch(
    userProfile: User["profile"],
    jobDescription: string
  ): Promise<JobAnalysis> {
    const analysisPrompt = PromptTemplate.fromTemplate(`
      Analyze the job match between the user profile and job description.
      
      User Profile:
      Name: {firstName} {lastName}
      Experience Level: {experience}
      Skills: {skills}
      Work Experience: {workExperience}
      Education: {education}
      
      Job Description:
      {jobDescription}
      
      Please provide a detailed analysis in the following JSON format:
      {{
        "requiredSkills": ["skill1", "skill2"],
        "preferredSkills": ["skill1", "skill2"],
        "matchingSkills": ["skill1", "skill2"],
        "missingSkills": ["skill1", "skill2"],
        "experienceGap": 0,
        "strengthAreas": ["area1", "area2"],
        "improvementAreas": ["area1", "area2"],
        "jobLevel": "mid"
      }}
    `);

    const chain = new LLMChain({
      llm: this.llm,
      prompt: analysisPrompt,
    });

    const result = await chain.call({
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      experience: userProfile.experience,
      skills: JSON.stringify(userProfile.skills),
      workExperience: JSON.stringify(userProfile.workExperience),
      education: JSON.stringify(userProfile.education),
      jobDescription: jobDescription,
    });

    return JSON.parse(result.text);
  }

  async calculateMatchScore(analysis: JobAnalysis): Promise<number> {
    const totalRequiredSkills = analysis.requiredSkills.length;
    const matchingRequiredSkills = analysis.matchingSkills.filter((skill) =>
      analysis.requiredSkills.includes(skill)
    ).length;

    const skillsMatchPercentage =
      totalRequiredSkills > 0
        ? (matchingRequiredSkills / totalRequiredSkills) * 100
        : 0;

    // Factor in experience gap
    const experienceScore = Math.max(0, 100 - analysis.experienceGap * 20);

    // Weighted average: 70% skills, 30% experience
    const finalScore = skillsMatchPercentage * 0.7 + experienceScore * 0.3;

    return Math.round(Math.min(100, Math.max(0, finalScore)));
  }

  async generateLearningPlan(
    analysis: JobAnalysis,
    userProfile: User["profile"]
  ): Promise<LearningPlan> {
    const learningPrompt = PromptTemplate.fromTemplate(`
      Create a personalized learning plan for the user to improve their job match.
      
      User Experience Level: {experience}
      Missing Skills: {missingSkills}
      Improvement Areas: {improvementAreas}
      Current Skills: {currentSkills}
      
      Create a learning plan with the following structure:
      {{
        "timeframe": "3-6 months",
        "phases": [
          {{
            "name": "Foundation Phase",
            "description": "Build core skills",
            "estimatedHours": 40,
            "resources": [
              {{
                "type": "video",
                "title": "Resource Title",
                "url": "https://youtube.com/example",
                "description": "Description",
                "estimatedHours": 10,
                "difficulty": "beginner",
                "provider": "YouTube",
                "isFree": true
              }}
            ],
            "projects": [
              {{
                "name": "Project Name",
                "description": "Project description",
                "technologies": ["tech1", "tech2"],
                "estimatedHours": 20,
                "difficulty": "beginner",
                "keyFeatures": ["feature1", "feature2"]
              }}
            ],
            "milestones": ["milestone1", "milestone2"]
          }}
        ],
        "totalEstimatedHours": 120,
        "priorityOrder": ["skill1", "skill2", "skill3"]
      }}
      
      Focus on practical, hands-on learning with real projects. Include resources from:
      - YouTube tutorials
      - freeCodeCamp
      - Coursera/edX free courses
      - Official documentation
      - GitHub repositories
      
      Make sure projects are portfolio-worthy and relevant to the target job.
    `);

    const chain = new LLMChain({
      llm: this.llm,
      prompt: learningPrompt,
    });

    const result = await chain.call({
      experience: userProfile.experience,
      missingSkills: JSON.stringify(analysis.missingSkills),
      improvementAreas: JSON.stringify(analysis.improvementAreas),
      currentSkills: JSON.stringify(userProfile.skills.map((s) => s.name)),
    });

    return JSON.parse(result.text);
  }
}
