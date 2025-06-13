import { UserRepository } from "../repositories/UserRepository";
import { JobApplicationRepository } from "../repositories/JobApplicationRepository";
import { AIService } from "./AIService";
import { JobApplication, User } from "../types";

export class JobAnalysisService {
  private userRepository: UserRepository;
  private jobApplicationRepository: JobApplicationRepository;
  private aiService: AIService;

  constructor() {
    this.userRepository = new UserRepository();
    this.jobApplicationRepository = new JobApplicationRepository();
    this.aiService = new AIService();
  }

  async analyzeJob(
    userId: string,
    jobDescription: string,
    jobTitle: string,
    companyName?: string
  ): Promise<JobApplication> {
    // Get user profile
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Analyze job match
    const analysis = await this.aiService.analyzeJobMatch(
      user.profile,
      jobDescription
    );

    // Calculate match score
    const matchScore = await this.aiService.calculateMatchScore(analysis);

    // Generate learning plan
    const learningPlan = await this.aiService.generateLearningPlan(
      analysis,
      user.profile
    );

    // Create job application record
    const jobApplication: Partial<JobApplication> = {
      userId,
      jobDescription,
      jobTitle,
      matchScore,
      analysis,
      learningPlan,
      status: "analyzed" as any,
      ...(companyName !== undefined ? { companyName } : {}),
    };

    return await this.jobApplicationRepository.create(jobApplication);
  }

  async getUserJobApplications(userId: string): Promise<JobApplication[]> {
    return await this.jobApplicationRepository.findByUserId(userId);
  }

  async getJobApplication(
    applicationId: string
  ): Promise<JobApplication | null> {
    return await this.jobApplicationRepository.findById(applicationId);
  }

  async updateApplicationStatus(
    applicationId: string,
    status: JobApplication["status"]
  ): Promise<JobApplication | null> {
    return await this.jobApplicationRepository.updateById(applicationId, {
      status,
    });
  }
}
