import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPropertySchema } from "@shared/schema";

// Middleware to check if user is admin
function isAdmin(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
  if (!req.isAuthenticated() || !req.user?.isAdmin) {
    return res.sendStatus(403);
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Admin routes
  app.get("/api/admin/users", isAdmin, async (_req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  // Property routes
  app.get("/api/properties", async (_req, res) => {
    const properties = await storage.getProperties();
    res.json(properties);
  });

  app.get("/api/properties/:id", async (req, res) => {
    const property = await storage.getProperty(Number(req.params.id));
    if (!property) return res.sendStatus(404);
    res.json(property);
  });

  app.post("/api/properties", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parseResult = insertPropertySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json(parseResult.error);
    }

    const property = await storage.createProperty({
      ...parseResult.data,
      userId: req.user!.id,
    });
    res.status(201).json(property);
  });

  app.patch("/api/properties/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const property = await storage.getProperty(Number(req.params.id));
    if (!property) return res.sendStatus(404);
    if (property.userId !== req.user!.id && !req.user!.isAdmin) return res.sendStatus(403);

    const updated = await storage.updateProperty(property.id, req.body);
    res.json(updated);
  });

  app.delete("/api/properties/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const property = await storage.getProperty(Number(req.params.id));
    if (!property) return res.sendStatus(404);
    if (property.userId !== req.user!.id && !req.user!.isAdmin) return res.sendStatus(403);

    await storage.deleteProperty(property.id);
    res.sendStatus(204);
  });

  app.get("/api/users/:userId/properties", async (req, res) => {
    const properties = await storage.getPropertiesByUser(Number(req.params.userId));
    res.json(properties);
  });

  const httpServer = createServer(app);
  return httpServer;
}