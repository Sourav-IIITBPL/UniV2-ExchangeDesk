import { useState, useEffect } from "react";
import { connectWallet, getEthBalance, getErc20Balance, getProvider } from "./web3/provider";
import * as Uniswap from "./web3/uniswap";
import { ethers } from "ethers";
import "./App.css";

import * as Liquidity from "./web3/liquidity.js";

function App() {

  //@dev- Wallet connection states.
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [ethBalance, setEthBalance] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [error, setError] = useState(null);

  //@dev- uniswap pool connection states.
  const [pairAddress, setPairAddress] = useState(null);
  const [reserves, setReserves] = useState(null);
  const [price, setPrice] = useState(null);

  // @dev- Router interaction states

  const [swapPreview, setSwapPreview] = useState(null);
  const [swapETHPreview, setSwapETHPreview] = useState(null);


  // @dev - Add liquidity states

  const [tokenA, setTokenA] = useState(null);
  const [tokenB, setTokenB] = useState(null);
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [LiqReserves, setLiqReserves] = useState(null);
  const [loading, setLoading] = useState(false);

  // @dev - Remove liquidity states
  const [removing, setRemoving] = useState(false);
  const [removingETH, setRemovingETH] = useState(false);
  const [liquidityAmount, setLiquidityAmount] = useState("");


  // @dev - Wallet connection functions .
  const handleConnect = async () => {
    try {
      const { provider, signer, address, chainId } = await connectWallet();

      setProvider(provider);
      setAddress(address);
      setSigner(signer);
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
    const ethBalanceChanged = async () => {
      const ethBal = await getEthBalance(provider, address);
      setEthBalance(ethBal);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("ETHChanged", ethBalanceChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
      window.ethereum.removeListener("ETHChanged", ethBalanceChanged);
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

  // @dev - Uniswap pool connection functions .

  const loadPoolData = async () => {
    if (!provider) return;

    // Example: WETH / USDC (mainnet)
    const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

    const pair = await Uniswap.getUniswapV2Pair(provider, WETH, USDC);

    if (!pair) {
      setPairAddress(null);
      setReserves(null);
      return;
    }

    setPairAddress(pair);

    const data = await Uniswap.getPairReserves(provider, pair);
    setReserves(data);

    // setting the price
    const priceValue = await Uniswap.derivePriceFromReserves(provider, data, WETH, USDC);
    setPrice(priceValue);

  };

  useEffect(() => {
    if (!provider) return;
    loadPoolData();
  }, [provider, chainId]);

  // @dev - Router02 interaction functions 

  const previewSwap = async () => {
    if (!provider) return;

    // Example: swap 0.01 WETH → USDC
    const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

    const amountIn = ethers.parseEther("0.01");  // exact integer
    const slippageBps = 50; // 0.5%

    const preview = await Uniswap.getSwapPreview(
      provider,
      amountIn,
      WETH,
      USDC,
      slippageBps
    );

    setSwapPreview(preview);
  };

  const executeSwap = async () => {
    if (!provider || !swapPreview) return;

    const signer = await provider.getSigner();
    console.log("getting signer:", signer);

    const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

    const amountIn = ethers.parseEther("0.01");

    // 1. Approve
    await Uniswap.approveToken(
      signer,
      WETH,
      Uniswap.UNISWAP_V2_ROUTER,
      amountIn
    );

    // 2. Swap
    await Uniswap.executeSwapExactTokensForTokens(
      signer,
      amountIn,
      swapPreview.amountOutMin,
      WETH,
      USDC,
      address
    );

    alert("Swap executed successfully");
  };


  const previewEthToTokenSwap = async () => {
    if (!provider) return;

    const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

    const ethAmountIn = ethers.parseEther("0.01");
    const slippageBps = 50; // 0.5%

    const preview = await Uniswap.getSwapPreview(
      provider,
      ethAmountIn,
      WETH,
      USDC,
      slippageBps
    );

    setSwapETHPreview(preview);
  };

  const executeEthToTokenSwap = async () => {
    if (!provider || !swapETHPreview) return;

    const signer = await provider.getSigner();
    const recipient = await signer.getAddress();

    const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

    const tx = await Uniswap.executeSwapExactETHForTokens(
      signer,
      swapETHPreview.amountOutMin,
      USDC,
      recipient,
      swapETHPreview.amountIn   // BigInt ETH value
    );

    await tx.wait();
    alert("ETH → Token swap successful");
  };




  // @dev - ADD LIQUIDITY handlers.

  async function handleAddLiquidity() {
    if (!provider || !signer || !address) return;

    try {
      setLoading(true);

      const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      const tokenA = { address: WETH, decimals: 18 };
      const tokenB = { address: USDC, decimals: 6 };
      const amountA = 0.01; // in ETH


      const amountABigInt = ethers.parseUnits(amountA.toString(), tokenA.decimals);


      const LiqReserves = await Liquidity.getPairAndReserves(
        provider,
        tokenA.address,
        tokenB.address
      );
      setLiqReserves(LiqReserves);

      if (!LiqReserves.exists) {
        alert("No existing liquidity pool for this pair.");
        setLoading(false);
        return;
      }

      const AmounttokenA = LiqReserves.reserveA;
      const AmounttokenB = LiqReserves.reserveB;

      const amountBBigInt = amountABigInt * AmounttokenB / AmounttokenA;

      // 1. Ensure approvals
      await Liquidity.ensureApproval(
        signer,
        tokenA.address,
        amountABigInt
      );

      await Liquidity.ensureApproval(
        signer,
        tokenB.address,
        amountBBigInt
      );

      // 2. Call  addLiquidity
      const tx = await Liquidity.addLiquidity(
        signer,
        tokenA.address,
        tokenB.address,
        amountABigInt,
        amountBBigInt,
        50,        // slippage = 0.50%
        address
      );

      await tx.wait();

      alert("Liquidity added successfully");
      prompt("Liquidity added: ", tx.liquidity);
    } catch (err) {
      console.error("Add liquidity failed:", err);
      alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLiquidityETH() {
    if (!provider || !signer || !address) return;

    try {
      const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      const tokenA = { address: WETH, decimals: 18 };
      const tokenB = { address: USDC, decimals: 6 };
      const amountA = 0.01; // in ETH


      const amountABigInt = ethers.parseUnits(amountA.toString(), tokenA.decimals);


      const LiqReserves = await Liquidity.getPairAndReserves(
        provider,
        tokenA.address,
        tokenB.address
      );
      setLiqReserves(LiqReserves);

      if (!LiqReserves.exists) {
        alert("No existing liquidity pool for this pair.");
        setLoading(false);
        return;
      }

      const AmounttokenA = LiqReserves.reserveA;
      const AmounttokenB = LiqReserves.reserveB;
      const ethAmount = ethers.parseEther("0.01");

      const amountBBigInt = ethAmount * AmounttokenB / AmounttokenA;


      await Liquidity.ensureApproval(
        signer,
        tokenB.address,
        amountBBigInt
      );



      const tx = await Liquidity.addLiquidityETH(
        signer,
        tokenB.address,
        amountBBigInt,
        ethAmount,
        50,        // 0.5% slippage
        address
      );

      await tx.wait();

      alert("ETH liquidity added");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    } finally {
      setLoading(false);
    }
  }


  async function handleRemoveLiquidity() {
    if (!signer || !address) return;

    try {
      setRemoving(true);

      // liquidityInput MUST be string
      const liquidityBigInt = ethers.parseEther("100"); // example 100 LP tokens

      const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      const tokenA = { address: WETH, decimals: 18 };
      const tokenB = { address: USDC, decimals: 6 };

      const tx = await Liquidity.removeLiquidity(
        signer,
        tokenA.address,
        tokenB.address,
        liquidityBigInt,
        50,        // 0.5% slippage
        address
      );

      await tx.wait();
      alert("Liquidity removed successfully");
    } catch (err) {
      console.error("Remove liquidity failed:", err);
      alert("Transaction failed");
    } finally {
      setRemoving(false);
    }
  }


  async function handleRemoveLiquidityETH() {
    if (!signer || !address) return;

    try {
      setRemovingETH(true);

      const liquidityBigInt = ethers.parseEther("100"); // example 100 LP tokens

      const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      const token = { address: USDC, decimals: 6 };

      const tx = await Liquidity.removeLiquidityETH(
        signer,
        token.address,
        liquidityBigInt,
        50,      // 0.5% slippage
        address
      );

      await tx.wait();
      alert("ETH liquidity removed");
    } catch (err) {
      console.error(err);
      alert("Transaction failed");
    } finally {
      setRemovingETH(false);
    }
  }



  return (
    <div style={{ padding: "2rem" }}>
      <h1>UniV2-ExchangeDesk</h1>

      {/* @dev - Wallet connection html . */}

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


      {/* // @dev - unniswap pool connection html . */}

      {pairAddress ? (
        <div>
          <p><strong>Uniswap V2 Pair:</strong> {pairAddress}</p>
          {reserves && (
            <>
              <p><strong>Reserve0:</strong> {reserves.reserve0.toString()}</p>
              <p><strong>Reserve1:</strong> {reserves.reserve1.toString()}</p>
              <p><strong>Last Interaction with pair:</strong> {reserves.LastInteract.toString()}</p>

            </>
          )}
        </div>
      ) : (
        <p>No Uniswap V2 pool exists for this pair.</p>
      )}

      {/* //@dev - price setting for tha pair  */}

      {price && (
        <p>
          <strong>Price:</strong> 1 WETH ≈ {price.toFixed(4)} USDC
        </p>
      )}

      <button onClick={previewSwap}>
        Preview Swap (0.01 WETH → USDC)
      </button>
      {swapPreview && (
        <div>
          <p>
            <strong>Expected Output:</strong>{" "}
            {ethers.formatUnits(swapPreview.amountOut, 6)} USDC
          </p>
          <p>
            <strong>Minimum Received:</strong>{" "}
            {ethers.formatUnits(swapPreview.amountOutMin, 6)} USDC
          </p>

        </div>
      )}
      {swapPreview && (
        <button onClick={executeSwap}>
          Execute Swap
        </button>
      )}

      <h3>ETH → Token Swap</h3>

      <button onClick={previewEthToTokenSwap}>
        Preview ETH → USDC (0.01 ETH)
      </button>

      {swapETHPreview && (
        <div>
          <p>
            <strong>Expected Output:</strong>{" "}
            {ethers.formatUnits(swapETHPreview.amountOut, 6)} USDC
          </p>
          <p>
            <strong>Minimum Received:</strong>{" "}
            {ethers.formatUnits(swapETHPreview.amountOutMin, 6)} USDC
          </p>

          <button onClick={executeEthToTokenSwap}>
            Execute ETH Swap
          </button>
        </div>
      )}


      <div>
        <button
          disabled={!provider || !signer}
          onClick={handleAddLiquidity}
        >
          {loading ? "Processing..." : "Add Liquidity of 0.01 WETH -> USDC"}
        </button>

      </div>
      <hr></hr>

      <div>
        <button
          disabled={!provider || !signer}
          onClick={handleAddLiquidityETH}
        >
          {loading ? "Processing..." : "Add Liquidity of 0.01 ETH -> USDC"}
        </button>

      </div>

      <div>
        <button
          disabled={!provider || !signer}
          onClick={handleRemoveLiquidity}
        >
          {removing ? "Processing..." : "Remove Liquidity of 100 LP tokens (WETH-USDC)"}
        </button>
      </div>
      <hr></hr>
      <div>
        <button
          disabled={!provider || !signer}
          onClick={handleRemoveLiquidityETH}
        >
          {removingETH ? "Processing..." : "Remove Liquidity of 100 LP tokens (WETH-USDC)"}
        </button>
      </div>



    </div>
  );

}

export default App;

