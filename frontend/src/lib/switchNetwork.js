// lib/switchNetwork.js

/**
 * @param {number} chainId - The decimal chain ID (e.g., 1 for Ethereum, 137 for Polygon)
 * @param {object} chainConfig - Metadata for the chain (required if the user needs to add the network)
 */
export async function switchNetwork(chainId, chainConfig) {
  if (!window.ethereum) throw new Error("No crypto wallet found");

  const hexChainId = `0x${chainId.toString(16)}`;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });
  } catch (switchError) {
    // Error code 4902 indicates the chain has not been added to MetaMask
    if (switchError.code === 4902 && chainConfig) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: hexChainId,
              chainName: chainConfig.name,
              nativeCurrency: chainConfig.nativeCurrency, // e.g., { name: 'MATIC', symbol: 'MATIC', decimals: 18 }
              rpcUrls: chainConfig.rpcUrls,
              blockExplorerUrls: chainConfig.blockExplorerUrls,
            },
          ],
        });
      } catch (addError) {
        throw new Error("Failed to add network to wallet");
      }
    } else {
      throw switchError;
    }
  }
}
