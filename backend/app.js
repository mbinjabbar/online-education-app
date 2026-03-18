import express from "express";
import cors from "cors";
import path from "path";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import subjectRoutes from "./src/routes/subject.routes.js";
import videoRoutes from "./src/routes/video.routes.js";
import { errorHandler, notFound } from "./src/middleware/errorHandler.middleware.js";

const app = express();

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());
app.use(compression());
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" }}));
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." }
}));

app.use("/uploads", express.static(path.join("public", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/videos", videoRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;