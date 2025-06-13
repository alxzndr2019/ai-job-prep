import { BaseRepository } from "./BaseRepository";
import UserModel from "../models/User";
import { User } from "../types";
import { Document } from "mongoose";

export class UserRepository extends BaseRepository<User & Document> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<(User & Document) | null> {
    return await this.model.findOne({ email }).exec();
  }

  async updateProfile(
    userId: string,
    profileData: Partial<User["profile"]>
  ): Promise<(User & Document) | null> {
    return await this.model
      .findByIdAndUpdate(
        userId,
        { $set: { profile: profileData } },
        { new: true }
      )
      .exec();
  }

  async addSkill(
    userId: string,
    skill: User["profile"]["skills"][0]
  ): Promise<(User & Document) | null> {
    return await this.model
      .findByIdAndUpdate(
        userId,
        { $push: { "profile.skills": skill } },
        { new: true }
      )
      .exec();
  }

  async removeSkill(
    userId: string,
    skillName: string
  ): Promise<(User & Document) | null> {
    return await this.model
      .findByIdAndUpdate(
        userId,
        { $pull: { "profile.skills": { name: skillName } } },
        { new: true }
      )
      .exec();
  }
}
