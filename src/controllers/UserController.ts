import { Request, Response } from "express";
import { UserRepository } from "../repositories/UserRepository";

interface AuthRequest extends Request {
  userId?: string;
}

export class UserController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const profileData = req.body;

      const updatedUser = await this.userRepository.updateProfile(
        userId,
        profileData
      );

      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Remove password from response
      const userResponse = { ...updatedUser.toObject() };
      delete userResponse.password;

      res.json({
        message: "Profile updated successfully",
        user: userResponse,
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Profile update failed",
      });
    }
  };

  addSkill = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const skill = req.body;

      const updatedUser = await this.userRepository.addSkill(userId, skill);

      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({
        message: "Skill added successfully",
        skills: updatedUser.profile.skills,
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to add skill",
      });
    }
  };

  removeSkill = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.userId!;
      const { skillName } = req.params;

      const updatedUser = await this.userRepository.removeSkill(
        userId,
        skillName as string
      );

      if (!updatedUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({
        message: "Skill removed successfully",
        skills: updatedUser.profile.skills,
      });
    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to remove skill",
      });
    }
  };
}
