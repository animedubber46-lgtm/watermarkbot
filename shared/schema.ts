import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We will use MongoDB for the actual storage as requested,
// but we define Drizzle schemas here for type inference and frontend compatibility.

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  telegramId: text("telegram_id").notNull().unique(),
  username: text("username"),
  firstName: text("first_name"),
  isBlocked: boolean("is_blocked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  telegramId: text("telegram_id").notNull(),
  fileId: text("file_id"),
  status: text("status").notNull(), // 'pending', 'processing', 'completed', 'failed'
  watermarkType: text("watermark_type"), // 'text', 'image'
  settings: jsonb("settings"), // { position, size, opacity, ... }
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, createdAt: true, completedAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type CreateUserRequest = InsertUser;
export type CreateJobRequest = InsertJob;
