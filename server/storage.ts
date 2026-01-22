import { User as UserType, InsertUser, Job as JobType, InsertJob } from "@shared/schema";
import { User, Job } from "./mongo";

export interface IStorage {
  getUser(id: number): Promise<UserType | undefined>;
  getUserByTelegramId(telegramId: string): Promise<UserType | undefined>;
  createUser(user: InsertUser): Promise<UserType>;
  
  getJobs(): Promise<JobType[]>;
  createJob(job: InsertJob): Promise<JobType>;
  updateJobStatus(id: number, status: string): Promise<void>;
  
  getStats(): Promise<{ totalUsers: number, totalJobs: number, activeJobs: number }>;
}

export class MongoStorage implements IStorage {
  async getUser(id: number): Promise<UserType | undefined> {
    // This is a bit tricky since Mongo uses ObjectIds, but Drizzle uses Serial IDs.
    // For this hybrid approach, we might not use this method much or map it.
    return undefined;
  }

  async getUserByTelegramId(telegramId: string): Promise<UserType | undefined> {
    const user = await User.findOne({ telegramId });
    if (!user) return undefined;
    return {
      id: 0, // Mock ID for compatibility
      telegramId: user.telegramId,
      username: user.username || null,
      firstName: user.firstName || null,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
    };
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    const user = await User.findOneAndUpdate(
      { telegramId: insertUser.telegramId },
      insertUser,
      { upsert: true, new: true }
    );
    return {
      id: 0,
      telegramId: user.telegramId,
      username: user.username || null,
      firstName: user.firstName || null,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
    };
  }

  async getJobs(): Promise<JobType[]> {
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(50);
    return jobs.map(j => ({
      id: 0,
      telegramId: j.telegramId,
      fileId: j.fileId || null,
      status: j.status,
      watermarkType: j.watermarkType || null,
      settings: j.settings,
      createdAt: j.createdAt,
      completedAt: j.completedAt || null,
    }));
  }

  async createJob(insertJob: InsertJob): Promise<JobType> {
    const job = await Job.create(insertJob);
    return {
      id: 0,
      telegramId: job.telegramId,
      fileId: job.fileId || null,
      status: job.status,
      watermarkType: job.watermarkType || null,
      settings: job.settings,
      createdAt: job.createdAt,
      completedAt: job.completedAt || null,
    };
  }

  async updateJobStatus(id: number, status: string): Promise<void> {
    // Implement if needed with Mongo ID
  }

  async getStats() {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'processing' });
    return { totalUsers, totalJobs, activeJobs };
  }
}

export const storage = new MongoStorage();
