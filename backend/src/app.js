import express from "express";
import cors from "cors";
import healthRoute from "./routes/health.js";
import pasteRoutes from "./routes/paste.js";


const app = express();

// app.use(cors({
//   origin: "http://localhost:5173"
// }));

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/healthz", healthRoute);

app.use("/api/pastes", pasteRoutes);
app.use("/p", pasteRoutes);





export default app;
