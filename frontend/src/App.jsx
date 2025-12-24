import { useState, useEffect } from "react";
import { connectWallet } from "./web3/provider";
import "./App.css";

function App() {
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    try {
      const { address, chainId } = await connectWallet();
      setAddress(address);
      setChainId(chainId);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        setAddress(null);
      } else {
        setAddress(accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex) => {
      setChainId(parseInt(chainIdHex, 16));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>UniV2-ExchangeDesk</h1>

      {!address ? (
        <button onClick={handleConnect}>Connect Wallet</button>
      ) : (
        <div>
          <p><strong>Connected Address:</strong> {address}</p>
          <p><strong>Chain ID:</strong> {chainId}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default App;

