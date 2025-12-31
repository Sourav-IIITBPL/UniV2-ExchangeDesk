import { useState } from "react";

export function useWallet() {
  const [account, setAccount] = useState(null);

  const connect = async () => {
    const [addr] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(addr);
  };

  return { account, connect };
}
