import express from "express";
import cors from "cors";
import helmet from "helmet";

import healthRoute from "./routes/health.js";
import pairsRoute from "./routes/pairs.js";
import eventsRoute from "./routes/events.js";
import candlesRoute from "./routes/candles.js";
import statsRoute from "./routes/stats.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/health", healthRoute);
app.use("/pairs", pairsRoute);
app.use("/events", eventsRoute);
app.use("/candles", candlesRoute);
app.use("/stats", statsRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

export default app;
