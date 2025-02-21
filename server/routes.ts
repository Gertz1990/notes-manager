import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express) {
  app.post("/api/waitlist", async (req, res) => {
    try {
      const data = insertWaitlistSchema.parse(req.body);

      const exists = await storage.isEmailInWaitlist(data.email);
      if (exists) {
        return res.status(400).json({ 
          message: "Этот email уже есть в списке ожидания" 
        });
      }

      const entry = await storage.addToWaitlist(data);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ 
          message: fromZodError(error).message 
        });
      } else {
        res.status(500).json({ 
          message: "Произошла непредвиденная ошибка" 
        });
      }
    }
  });

  return createServer(app);
}