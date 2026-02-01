import express from "express";
import cors from "cors";
import healthRoute from "./routes/health.js";
import pasteApiRoutes from "./routes/pastes.api.js";
import pasteViewRoutes from "./routes/pastes.view.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/healthz", healthRoute);
app.use("/api/pastes", pasteApiRoutes);
app.use("/p", pasteViewRoutes);

export default app;
