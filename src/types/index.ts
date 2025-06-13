export interface User {
  _id?: string;
  email: string;
  password: string;
  profile: UserProfile;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  title?: string;
  experience: ExperienceLevel;
  skills: Skill[];
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  certifications: Certification[];
  preferences: JobPreferences;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsOfExperience?: number;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: number;
  gpa?: number;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  technologies: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  startDate: Date;
  endDate?: Date;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
}

export interface JobPreferences {
  desiredRoles: string[];
  industries: string[];
  workType: WorkType[];
  salaryRange?: SalaryRange;
  locations: string[];
}

export interface JobApplication {
  _id?: string;
  userId: string;
  jobDescription: string;
  companyName?: string;
  jobTitle: string;
  matchScore: number;
  analysis: JobAnalysis;
  learningPlan: LearningPlan;
  status: ApplicationStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JobAnalysis {
  requiredSkills: string[];
  preferredSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  experienceGap: number;
  strengthAreas: string[];
  improvementAreas: string[];
  jobLevel: ExperienceLevel;
}

export interface LearningPlan {
  timeframe: string;
  phases: LearningPhase[];
  totalEstimatedHours: number;
  priorityOrder: string[];
}

export interface LearningPhase {
  name: string;
  description: string;
  estimatedHours: number;
  resources: LearningResource[];
  projects: ProjectSuggestion[];
  milestones: string[];
}

export interface LearningResource {
  type: ResourceType;
  title: string;
  url: string;
  description: string;
  estimatedHours: number;
  difficulty: DifficultyLevel;
  provider: string;
  isFree: boolean;
}

export interface ProjectSuggestion {
  name: string;
  description: string;
  technologies: string[];
  estimatedHours: number;
  difficulty: DifficultyLevel;
  githubTemplate?: string;
  keyFeatures: string[];
}

export enum ExperienceLevel {
  ENTRY = "entry",
  JUNIOR = "junior",
  MID = "mid",
  SENIOR = "senior",
  LEAD = "lead",
  PRINCIPAL = "principal",
}

export enum SkillCategory {
  PROGRAMMING = "programming",
  FRAMEWORK = "framework",
  DATABASE = "database",
  CLOUD = "cloud",
  DEVOPS = "devops",
  DESIGN = "design",
  SOFT_SKILLS = "soft_skills",
  TOOLS = "tools",
}

export enum ProficiencyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}

export enum WorkType {
  REMOTE = "remote",
  HYBRID = "hybrid",
  ONSITE = "onsite",
}

export enum ApplicationStatus {
  ANALYZED = "analyzed",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export enum ResourceType {
  VIDEO = "video",
  COURSE = "course",
  TUTORIAL = "tutorial",
  DOCUMENTATION = "documentation",
  BOOK = "book",
  PRACTICE = "practice",
}

export enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}
