import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // No API routes needed for the calculator
  // The app is purely client-side logic
  
  return httpServer;
}
