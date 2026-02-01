import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoute from "./routes/health.js";
import pairsRoute from "./routes/pairs.js";
import eventsRoute from "./routes/events.js";
import candlesRoute from "./routes/candles.js";
import statsRoute from "./routes/stats.js";
import swapRoute from "./routes/swap.js";

const app = express();

app.use(helmet());
app.use(cors());
// Manual CSP Header Fix for Development
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:4000;",
  );
  next();
});

app.use(express.json());

app.use("/health", healthRoute);
app.use("/pairs", pairsRoute);
app.use("/events", eventsRoute);
app.use("/candles", candlesRoute);
app.use("/stats", statsRoute);
app.use("/swap", swapRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

export default app;
