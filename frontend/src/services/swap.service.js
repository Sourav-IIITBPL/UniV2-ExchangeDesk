export async function swapExactTokensForTokens({
  router,
  amountIn,
  amountOutMin,
  path,
  to,
  deadline,
}) {
  return router.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    to,
    deadline,
  );
}
