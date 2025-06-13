import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../types";

export class AuthService {
  private userRepository: UserRepository;
  private jwtSecret: string;

  constructor() {
    this.userRepository = new UserRepository();
    this.jwtSecret = process.env.JWT_SECRET || "your-secret-key";
  }

  async register(
    userData: Omit<User, "_id" | "createdAt" | "updatedAt">
  ): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Generate token
    const token = this.generateToken(user._id!.toString());

    return { user, token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = this.generateToken(user._id!.toString());

    return { user, token };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: "1h" });
  }
  verifyToken(token: string): { userId: string } {
    return jwt.verify(token, this.jwtSecret) as { userId: string };
  }
}
