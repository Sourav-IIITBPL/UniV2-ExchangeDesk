import { useState } from "react";
import { DEFAULT_SLIPPAGE } from "../config/constants";

export function useSlippage() {
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);
  return { slippage, setSlippage };
}
