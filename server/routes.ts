import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { connectToMongo } from "./mongo";
import { startBot } from "./bot";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Connect to MongoDB
  await connectToMongo();

  // Start the Telegram Bot
  // We don't await this because it's a long running process
  startBot().catch(console.error);

  // API Routes
  app.get(api.stats.get.path, async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  app.get(api.users.list.path, async (req, res) => {
    // Only return latest 50 for demo
    // In real app, add pagination
    const users = await storage.getUserByTelegramId("demo"); // Placeholder
    res.json([]); 
  });

  app.get(api.jobs.list.path, async (req, res) => {
    const jobs = await storage.getJobs();
    res.json(jobs);
  });

  return httpServer;
}
