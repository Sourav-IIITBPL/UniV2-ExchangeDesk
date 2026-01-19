import { useEffect, useState } from "react";
import { getExchangeDeskRouter } from "../lib/contracts";

export function useRouter(chainId) {
  const [router, setRouter] = useState(null);

  useEffect(() => {
    if (!chainId) return;
    getExchangeDeskRouter(chainId).then(setRouter);
  }, [chainId]);

  return router;
}
