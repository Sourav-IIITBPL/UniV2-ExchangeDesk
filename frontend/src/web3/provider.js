import { ethers } from "ethers";

export async function getProvider() {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected");
  }

  return new ethers.BrowserProvider(window.ethereum);
}

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected! Please try again");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  // Request account access
  await provider.send("eth_requestAccounts", []);

  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();

  return {
    provider,
    signer,
    address,
    chainId: Number(network.chainId),
  };
}

export async function getEthBalance(provider, address) {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

export async function getErc20Balance(provider, tokenAddress, userAddress) {
  const erc20Abi = [
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
  ];

  const token = new ethers.Contract(tokenAddress, erc20Abi, provider);

  const [balance, decimals, symbol] = await Promise.all([
    token.balanceOf(userAddress),
    token.decimals(),
    token.symbol(),
  ]);

  return {
    balance: ethers.formatUnits(balance, decimals),
    symbol,
  };
}
