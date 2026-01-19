export function normalizeReserve(raw, decimals) {
  return Number(raw) / 10 ** decimals
}

export function computePrice(
  reserve0,
  reserve1
) {
  if (reserve0 === 0) return 0
  return (reserve1 / reserve0)
}

export function computeTVL(
  reserve0,
  reserve1
) {
  return reserve0 + reserve1
}
