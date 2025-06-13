import { Request, Response, NextFunction } from "express";
import { JobAnalysisService } from "../services/JobAnalysisService";

interface AuthRequest extends Request {
  userId?: string;
}

export class JobController {
  private jobAnalysisService: JobAnalysisService;

  constructor() {
    this.jobAnalysisService = new JobAnalysisService();
  }

  analyzeJob = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { jobDescription, jobTitle, companyName } = req.body;
      const userId = req.userId!;

      const analysis = await this.jobAnalysisService.analyzeJob(
        userId,
        jobDescription,
        jobTitle,
        companyName
      );

      res.status(201).json({
        message: "Job analyzed successfully",
        analysis,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserApplications = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.userId!;
      const applications = await this.jobAnalysisService.getUserJobApplications(
        userId
      );

      res.json({
        applications,
        total: applications.length,
      });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to get applications",
      });
    }
  };

  getApplication = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const application = await this.jobAnalysisService.getJobApplication(
        applicationId as string
      );

      if (!application) {
        res.status(404).json({ error: "Application not found" });
        return;
      }

      // Verify ownership
      if (application.userId !== req.userId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }

      res.json({ application });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to get application",
      });
    }
  };

  updateApplicationStatus = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;

      // First verify ownership
      const application = await this.jobAnalysisService.getJobApplication(
        applicationId as string
      );
      if (!application) {
        res.status(404).json({ error: "Application not found" });
        return;
      }

      if (application.userId !== req.userId) {
        res.status(403).json({ error: "Access denied" });
        return;
      }

      const updatedApplication =
        await this.jobAnalysisService.updateApplicationStatus(
          applicationId as string,
          status
        );

      res.json({
        message: "Application status updated",
        application: updatedApplication,
      });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update application status",
      });
    }
  };
}
