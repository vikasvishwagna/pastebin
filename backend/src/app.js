// server.js or app.js
import express from "express";
import cors from "cors";
import crypto from "crypto";
import redis from "./config/redis.js"; // Upstash client
import pasteApiRoutes from "./routes/pastes.api.js";
import pasteViewRoutes from "./routes/pastes.view.js";
import healthRoute from "./routes/health.js";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.use("/api/healthz", healthRoute);

// API routes
app.use("/api/pastes", pasteApiRoutes);

// HTML view routes
app.use("/p", pasteViewRoutes);

export default app;
