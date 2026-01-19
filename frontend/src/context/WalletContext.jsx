import { createContext, useContext, useState } from "react";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);

  const connect = async () => {
    const [addr] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(addr);
  };

  return (
    <WalletContext.Provider value={{ account, connect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
