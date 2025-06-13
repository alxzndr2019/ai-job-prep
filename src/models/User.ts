import mongoose, { Schema, Document } from "mongoose";
import {
  User,
  UserProfile,
  ExperienceLevel,
  SkillCategory,
  ProficiencyLevel,
  WorkType,
} from "../types";

const SkillSchema = new Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: Object.values(SkillCategory),
    required: true,
  },
  proficiency: {
    type: String,
    enum: Object.values(ProficiencyLevel),
    required: true,
  },
  yearsOfExperience: { type: Number, min: 0 },
});

const EducationSchema = new Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  gpa: { type: Number, min: 0, max: 4 },
});

const WorkExperienceSchema = new Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  description: { type: String, required: true },
  technologies: [{ type: String }],
});

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  githubUrl: { type: String },
  liveUrl: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
});

const CertificationSchema = new Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: Date, required: true },
  expiryDate: { type: Date },
  credentialId: { type: String },
});

const JobPreferencesSchema = new Schema({
  desiredRoles: [{ type: String }],
  industries: [{ type: String }],
  workType: [{ type: String, enum: Object.values(WorkType) }],
  salaryRange: {
    min: { type: Number },
    max: { type: Number },
    currency: { type: String, default: "USD" },
  },
  locations: [{ type: String }],
});

const UserProfileSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  title: { type: String },
  experience: {
    type: String,
    enum: Object.values(ExperienceLevel),
    required: true,
  },
  skills: [SkillSchema],
  education: [EducationSchema],
  workExperience: [WorkExperienceSchema],
  projects: [ProjectSchema],
  certifications: [CertificationSchema],
  preferences: JobPreferencesSchema,
});

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: UserProfileSchema, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<User & Document>("User", UserSchema);
