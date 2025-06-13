import { Router } from "express";
import { UserController } from "../controllers/UserContoller";
import { AuthService } from "../services/AuthService";
import { authenticateToken } from "../middleware/auth";
import Joi from "joi";
import { validateRequest } from "../middleware/validation";

const router = Router();
const userController = new UserController();
const authService = new AuthService();

const skillSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string()
    .valid(
      "programming",
      "framework",
      "database",
      "cloud",
      "devops",
      "design",
      "soft_skills",
      "tools"
    )
    .required(),
  proficiency: Joi.string()
    .valid("beginner", "intermediate", "advanced", "expert")
    .required(),
  yearsOfExperience: Joi.number().min(0).optional(),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  title: Joi.string().optional(),
  experience: Joi.string()
    .valid("entry", "junior", "mid", "senior", "lead", "principal")
    .optional(),
  skills: Joi.array().items(skillSchema).optional(),
  education: Joi.array().optional(),
  workExperience: Joi.array().optional(),
  projects: Joi.array().optional(),
  certifications: Joi.array().optional(),
  preferences: Joi.object().optional(),
});

router.patch(
  "/profile",
  authenticateToken(authService),
  validateRequest(updateProfileSchema),
  userController.updateProfile
);

router.post(
  "/skills",
  authenticateToken(authService),
  validateRequest(skillSchema),
  userController.addSkill
);

router.delete(
  "/skills/:skillName",
  authenticateToken(authService),
  userController.removeSkill
);

export default router;
