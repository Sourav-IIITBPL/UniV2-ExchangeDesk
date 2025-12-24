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
