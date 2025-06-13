import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";

interface AuthRequest extends Request {
  userId?: string;
}

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user, token } = await this.authService.register(req.body);

      // Remove password from response
      const { password, ...userResponse } = user;

      res.status(201).json({
        message: "User registered successfully",
        user: userResponse,
        token,
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);

      // Remove password from response
      const { password: _password, ...userResponse } = user;

      res.json({
        message: "Login successful",
        user: userResponse,
        token,
      });
    } catch (error) {
      res.status(401).json({
        error: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  getProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userRepository = new (
        await import("../repositories/UserRepository")
      ).UserRepository();
      const user = await userRepository.findById(req.userId!);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Remove password from response
      const userResponse = { ...user.toObject() };
      delete userResponse.password;

      res.json({ user: userResponse });
    } catch (error) {
      next(error);
    }
  };
}
