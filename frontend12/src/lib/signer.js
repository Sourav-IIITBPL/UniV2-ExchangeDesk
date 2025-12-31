import { getProvider } from "./provider";

export async function getSigner() {
  const provider = getProvider();
  return provider.getSigner();
}
