import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertNoteSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express) {
  // Set up authentication routes
  setupAuth(app);

  // Notes routes
  app.get("/api/notes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }
    const notes = await storage.getNotes(req.user.id);
    res.json(notes);
  });

  app.post("/api/notes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }

    try {
      const data = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(req.user.id, data);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Произошла непредвиденная ошибка" });
      }
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }

    try {
      const data = insertNoteSchema.partial().parse(req.body);
      const note = await storage.updateNote(
        parseInt(req.params.id),
        req.user.id,
        data,
      );
      if (!note) {
        return res.status(404).json({ message: "Заметка не найдена" });
      }
      res.json(note);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Произошла непредвиденная ошибка" });
      }
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }

    await storage.deleteNote(parseInt(req.params.id), req.user.id);
    res.sendStatus(200);
  });

  return createServer(app);
}