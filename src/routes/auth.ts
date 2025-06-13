import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

import { AuthService } from "../services/AuthService";
import {
  validateRequest,
  registerSchema,
  loginSchema,
} from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";

const router = Router();
const authController = new AuthController();
const authService = new AuthService();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);
router.post("/login", validateRequest(loginSchema), authController.login);
router.get(
  "/profile",
  authenticateToken(authService),
  authController.getProfile
);

export default router;
