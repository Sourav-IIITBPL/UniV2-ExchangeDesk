import { Router } from "express";
import { getpreviewExactInSwap,getpreviewExactOutSwap,getExactInSwap,getExactOutSwap } from "../controllers/swap.controller.js";

const router = Router();

router.get("/previewExactIn", getpreviewExactInSwap);
router.get("/previewExactOut", getpreviewExactOutSwap);
router.get("/ExactIn", getExactInSwap);
router.get("/ExactOut", getExactOutSwap);

export default router;