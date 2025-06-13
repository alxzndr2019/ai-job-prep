import mongoose, { Schema, Document } from "mongoose";
import {
  JobApplication,
  ApplicationStatus,
  ResourceType,
  DifficultyLevel,
} from "../types";

const LearningResourceSchema = new Schema({
  type: { type: String, enum: Object.values(ResourceType), required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, required: true },
  estimatedHours: { type: Number, required: true },
  difficulty: {
    type: String,
    enum: Object.values(DifficultyLevel),
    required: true,
  },
  provider: { type: String, required: true },
  isFree: { type: Boolean, default: true },
});

const ProjectSuggestionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  estimatedHours: { type: Number, required: true },
  difficulty: {
    type: String,
    enum: Object.values(DifficultyLevel),
    required: true,
  },
  githubTemplate: { type: String },
  keyFeatures: [{ type: String }],
});

const LearningPhaseSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  estimatedHours: { type: Number, required: true },
  resources: [LearningResourceSchema],
  projects: [ProjectSuggestionSchema],
  milestones: [{ type: String }],
});

const JobApplicationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobDescription: { type: String, required: true },
    companyName: { type: String },
    jobTitle: { type: String, required: true },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    analysis: {
      requiredSkills: [{ type: String }],
      preferredSkills: [{ type: String }],
      matchingSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      experienceGap: { type: Number },
      strengthAreas: [{ type: String }],
      improvementAreas: [{ type: String }],
      jobLevel: { type: String },
    },
    learningPlan: {
      timeframe: { type: String, required: true },
      phases: [LearningPhaseSchema],
      totalEstimatedHours: { type: Number, required: true },
      priorityOrder: [{ type: String }],
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.ANALYZED,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<JobApplication & Document>(
  "JobApplication",
  JobApplicationSchema
);
