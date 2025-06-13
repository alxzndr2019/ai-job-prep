import { Router } from "express";
import { JobController } from "../controllers/JobController";
import { AuthService } from "../services/AuthService";
import { validateRequest, jobAnalysisSchema } from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";
import Joi from "joi";

const router = Router();
const jobController = new JobController();
const authService = new AuthService();

const updateStatusSchema = Joi.object({
  status: Joi.string().valid("analyzed", "in_progress", "completed").required(),
});

router.post(
  "/analyze",
  authenticateToken(authService),
  validateRequest(jobAnalysisSchema),
  jobController.analyzeJob
);

router.get(
  "/applications",
  authenticateToken(authService),
  jobController.getUserApplications
);

router.get(
  "/applications/:applicationId",
  authenticateToken(authService),
  jobController.getApplication
);

router.patch(
  "/applications/:applicationId/status",
  authenticateToken(authService),
  validateRequest(updateStatusSchema),
  jobController.updateApplicationStatus
);

export default router;
