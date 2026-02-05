import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { BrowserProvider } from "ethers";
import { switchNetwork } from "../lib/switchNetwork";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  // Initialize Provider once (Singleton pattern)
  const provider = useMemo(() => {
    return typeof window !== "undefined" && window.ethereum 
      ? new BrowserProvider(window.ethereum) 
      : null;
  }, []);

  const connect = async () => {
    if (!provider) return alert("MetaMask not found");
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
    const network = await provider.getNetwork();
    setChainId(Number(network.chainId));
  };

  const selectChain = async (id) => {
    try {
      await switchNetwork(id);
      // chainId state will be updated automatically by the listener below
    } catch (err) {
      console.error("Failed to switch network", err);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      // Listen for account switches
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });

      // Listen for network switches
      window.ethereum.on("chainChanged", (hexId) => {
        setChainId(parseInt(hexId, 16));
        // Professional tip: reload to clear stale contract state
        window.location.reload(); 
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, chainId, provider, connect, selectChain }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);