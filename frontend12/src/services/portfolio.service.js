// READ-ONLY portfolio aggregation
// Backend should eventually compute these efficiently

export async function fetchPortfolio({ chainId, user }) {
  if (!user) return null;

  return {
    tokens: [
      { symbol: "USDC", balance: "1200.50" },
      { symbol: "ETH", balance: "0.82" },
    ],
    liquidity: [
      {
        pool: "ETH / USDC",
        share: "0.42%",
        feesEarnedUsd: "34.21",
      },
    ],
  };
}
