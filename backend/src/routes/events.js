import { Router } from "express";
import {
  getSwapEvents,
  getLiquidityEvents,
} from "../controllers/events.controller.js";

const router = Router();

router.get("/swaps", getSwapEvents);
router.get("/liquidity", getLiquidityEvents);

export default router;
