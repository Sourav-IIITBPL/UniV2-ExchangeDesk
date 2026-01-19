export async function addLiquidity({
  router,
  tokenA,
  tokenB,
  amountA,
  amountB,
  amountAMin,
  amountBMin,
  to,
  deadline,
}) {
  return router.addLiquidity(
    tokenA,
    tokenB,
    amountA,
    amountB,
    amountAMin,
    amountBMin,
    to,
    deadline,
  );
}

export async function createPair(router, tokenA, tokenB) {
  return router.createPairIfNotExists(tokenA, tokenB);
}
