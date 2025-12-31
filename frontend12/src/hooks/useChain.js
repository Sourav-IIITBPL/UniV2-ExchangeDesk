import { useState } from "react";
import { switchNetwork } from "../lib/switchNetwork";

export function useChain() {
  const [chainId, setChainId] = useState(null);

  const selectChain = async (id) => {
    await switchNetwork(id);
    setChainId(id);
  };

  return { chainId, selectChain };
}
