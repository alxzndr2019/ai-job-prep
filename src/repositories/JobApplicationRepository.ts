import { BaseRepository } from "./BaseRepository";
import JobApplicationModel from "../models/JobApplication";
import { JobApplication } from "../types";
import { Document } from "mongoose";

export class JobApplicationRepository extends BaseRepository<
  JobApplication & Document
> {
  constructor() {
    super(JobApplicationModel);
  }

  async findByUserId(userId: string): Promise<(JobApplication & Document)[]> {
    return await this.model.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findByUserAndJobTitle(
    userId: string,
    jobTitle: string
  ): Promise<(JobApplication & Document) | null> {
    return await this.model.findOne({ userId, jobTitle }).exec();
  }

  async updateMatchScore(
    applicationId: string,
    matchScore: number
  ): Promise<(JobApplication & Document) | null> {
    return await this.model
      .findByIdAndUpdate(applicationId, { matchScore }, { new: true })
      .exec();
  }

  async updateLearningPlan(
    applicationId: string,
    learningPlan: JobApplication["learningPlan"]
  ): Promise<(JobApplication & Document) | null> {
    return await this.model
      .findByIdAndUpdate(applicationId, { learningPlan }, { new: true })
      .exec();
  }
}
