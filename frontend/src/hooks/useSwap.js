import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import * as swapService from "../services/swap.service";
import { switchNetwork } from "../lib/switchNetwork";
import {
  CHAINS_ID_TO_NAME,
  CHAINS_NAME_TO_ID,
  CHAIN_METADATA,
} from "../config/constants";

export function useSwap() {
  const { provider, chainId } = useWallet();
  const [swapLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeSwap = async (protocol, params) => {
    setLoading(true);
    setError(null);

    try {
      // const currentNetwork = await provider.getNetwork();
      const currentChainId = Number(chainId);

      const currentChainIdToName = CHAINS_ID_TO_NAME[currentChainId];

      //  CHAIN CHECK: If wallet chain !== intended swap chain
      if (currentChainIdToName !== params.chain) {
        console.log("Wrong network detected. Prompting switch...");
        await switchNetwork(CHAINS_NAME_TO_ID[params.chain]);

        // Stop the execution here.
        // The 'chainChanged' listener in your WalletContext will
        // trigger a page reload to sync the app with the new chain.
        setLoading(false);
        return;
      }
      const signer = await provider.getSigner();

      let receipt;
      const ID = CHAINS_NAME_TO_ID[params.chain];
      const WETH = CHAIN_METADATA[ID].wrapper;
      const path = params.path;
      let isNativeIn = false;
      let isNativeOut = false;
      if (params.type === "ExactIn") {
        isNativeIn = path[0] === WETH ? true : false;
      } else {
        isNativeOut = path[path.length - 1] === WETH ? true : false;
      }

      // Logic to determine which service function to call
      if (params.type === "ExactIn") {
        if (isNativeIn) {
          receipt = await swapService.getExactETHForTokens(
            signer,
            params.chain,
            protocol,
            params.amountInToSwap,
            params.slippage,
            params.path,
          );
        } else if (isNativeOut) {
          receipt = await swapService.getExactTokensForETH(
            signer,
            params.chain,
            protocol,
            params.amountInToSwap,
            params.slippage,
            params.path,
          );
        } else {
          receipt = await swapService.getExactTokensForTokens(
            signer,
            params.chain,
            protocol,
            params.amountInToSwap,
            params.slippage,
            params.path,
          );
        }
      } else {
        // ExactOut logic...
        if (isNativeIn) {
          receipt = await swapService.getETHForExactTokens(
            signer,
            params.chain,
            protocol,
            params.amountOutToSwap,
            params.amountInToSwap,
            params.slippage,
            params.path,
          );
        } else if (isNativeOut) {
          receipt = await swapService.swapTokensForExactETH(
            signer,
            params.chain,
            protocol,
            params.amountOutToSwap,
            params.amountInToSwap,
            params.slippage,
            params.path,
          );
        } else {
          receipt = await swapService.getTokensForExactTokens(
            signer,
            params.chain,
            protocol,
            params.amountOutToSwap,
            params.amountInToSwap,
            params.slippage,
            params.path,
          );
        }
      }

      setLoading(false);
      return receipt;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { executeSwap, swapLoading, error };
}
