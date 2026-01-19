import { Router } from "express";
import { getPairCandles } from "../controllers/candles.controller.js";

const router = Router();

router.get("/", getPairCandles);

export default router;
