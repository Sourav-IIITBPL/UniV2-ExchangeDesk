import { Router } from "express";
import {
  getpreviewExactInSwap,
  getpreviewExactOutSwap,
} from "../controllers/swap.controller.js";

const router = Router();

router.get("/previewExactIn", getpreviewExactInSwap);
router.get("/previewExactOut", getpreviewExactOutSwap);

export default router;
