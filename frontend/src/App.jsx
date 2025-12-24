import { useState, useEffect } from "react";
import { getProvider, connectWallet, getEthBalance, getErc20Balance } from "./web3/provider";
import "./App.css";

function App() {
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [provider, setProvider] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);

  const [error, setError] = useState(null);

  const handleConnect = async () => {
    try {
      const { provider,signer, address, chainId } = await connectWallet();

      setProvider(provider);
      setAddress(address);
      setChainId(chainId);
      setError(null);

      const ethBal = await getEthBalance(provider, address);
      setEthBalance(ethBal);
      await loadTokenBalance();

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

  useEffect(() => {
  if (!provider || !address) return;

  const loadBalances = async () => {
    const ethBal = await getEthBalance(provider, address);
    setEthBalance(ethBal);
    await loadTokenBalance();
  };

  loadBalances();
}, [provider, address, chainId]);


  const loadTokenBalance = async () => {
    if (!provider || !address) return;
    try {
      // Example: USDC on mainnet (change later)
      const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

      const tokenData = await getErc20Balance(
        provider,
        USDC_ADDRESS,
        address
      );

      setTokenBalance(tokenData);
    }

    catch (err) {
      console.error("Token balance fetch failed:", err);
      setTokenBalance(null);
    }
  };


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

    {address && (
      <div>
        <p><strong>ETH Balance:</strong> {ethBalance}</p>

        {tokenBalance ? (
          <p>
            <strong>{tokenBalance.symbol} Balance:</strong>{" "}
            {tokenBalance.balance}
          </p>
        ) : (
          <p>ERC20 balance not available on this network</p>
        )}
      </div>
    )}
  </div>
);

}

export default App;

