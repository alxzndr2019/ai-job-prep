import { Document, Model, FilterQuery, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data);
    return await entity.save();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter).exec();
  }

  async findMany(
    filter: FilterQuery<T>,
    limit?: number,
    skip?: number
  ): Promise<T[]> {
    let query = this.model.find(filter);

    if (skip) query = query.skip(skip);
    if (limit) query = query.limit(limit);

    return await query.exec();
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteById(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    return await this.model.countDocuments(filter).exec();
  }
}
