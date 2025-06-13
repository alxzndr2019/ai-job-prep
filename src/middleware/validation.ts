import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ error: error.details?.[0]?.message || "Validation error" });
      return;
    }
    next();
  };
};

// export function validateRequest(schema: any) {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const { error } = schema.validate(req.body);
//     if (error) {
//       res.status(400).json({ error: error.details[0].message });
//       return;
//     }
//     next();
//   };
// }

// Validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  profile: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    title: Joi.string().optional(),
    experience: Joi.string()
      .valid("entry", "junior", "mid", "senior", "lead", "principal")
      .required(),
    skills: Joi.array()
      .items(
        Joi.object({
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
        })
      )
      .required(),
    education: Joi.array()
      .items(
        Joi.object({
          institution: Joi.string().required(),
          degree: Joi.string().required(),
          field: Joi.string().required(),
          graduationYear: Joi.number().required(),
          gpa: Joi.number().min(0).max(4).optional(),
        })
      )
      .optional(),
    workExperience: Joi.array()
      .items(
        Joi.object({
          company: Joi.string().required(),
          position: Joi.string().required(),
          startDate: Joi.date().required(),
          endDate: Joi.date().optional(),
          description: Joi.string().required(),
          technologies: Joi.array().items(Joi.string()).optional(),
        })
      )
      .optional(),
    projects: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          description: Joi.string().required(),
          technologies: Joi.array().items(Joi.string()).required(),
          githubUrl: Joi.string().uri().optional(),
          liveUrl: Joi.string().uri().optional(),
          startDate: Joi.date().required(),
          endDate: Joi.date().optional(),
        })
      )
      .optional(),
    certifications: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          issuer: Joi.string().required(),
          issueDate: Joi.date().required(),
          expiryDate: Joi.date().optional(),
          credentialId: Joi.string().optional(),
        })
      )
      .optional(),
    preferences: Joi.object({
      desiredRoles: Joi.array().items(Joi.string()).optional(),
      industries: Joi.array().items(Joi.string()).optional(),
      workType: Joi.array()
        .items(Joi.string().valid("remote", "hybrid", "onsite"))
        .optional(),
      salaryRange: Joi.object({
        min: Joi.number().optional(),
        max: Joi.number().optional(),
        currency: Joi.string().default("USD"),
      }).optional(),
      locations: Joi.array().items(Joi.string()).optional(),
    }).optional(),
  }).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const jobAnalysisSchema = Joi.object({
  jobDescription: Joi.string().required(),
  jobTitle: Joi.string().required(),
  companyName: Joi.string().optional(),
});
