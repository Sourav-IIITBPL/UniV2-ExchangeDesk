import { Router } from "express";
import {
  listPairs,
  checkPair,
  getPairByAddress,
} from "../controllers/pairs.controller.js";

const router = Router();

router.get("/", listPairs);
router.get("/check", checkPair);
router.get("/address", getPairByAddress);

export default router;
