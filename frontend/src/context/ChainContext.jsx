import { createContext, useContext, useState } from "react";
import { switchNetwork } from "../lib/switchNetwork";

const ChainContext = createContext(null);

export function ChainProvider({ children }) {
  const [chainId, setChainId] = useState(null);

  const selectChain = async (id) => {
    await switchNetwork(id);
    setChainId(id);
  };

  return (
    <ChainContext.Provider value={{ chainId, selectChain }}>
      {children}
    </ChainContext.Provider>
  );
}

export function useChain() {
  return useContext(ChainContext);
}


