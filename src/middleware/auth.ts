import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";

interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (authService: AuthService) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    try {
      const decoded = authService.verifyToken(token);
      req.userId = decoded.userId;
      next();
      return;
    } catch (error) {
      res.status(403).json({ error: "Invalid or expired token" });
      return;
    }
  };
};

// export function authenticateToken(authService: AuthService) {
//   return function (req: AuthRequest, res: Response, next: NextFunction) {
//     // ... your logic ...
//     if (!tokenIsValid) {
//       res.status(401).json({ message: "Unauthorized" });
//       return;
//     }
//     // ... more logic ...
//     next();
//   };
// }
