import { BrowserProvider } from "ethers";

export function getProvider() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }
  return new BrowserProvider(window.ethereum);
}
