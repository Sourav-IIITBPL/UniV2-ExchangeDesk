import { apiGet } from "./api";

export async function previewExactIn({ chain, protocol, tokenIn, tokenOut, amountIn , TokenList }){

  //  chain = "ethereum",
  //           protocol = "uniswap",
  //           tokenIn = 0x00,
  //           tokenOut = 0x00,
  //           amountIn = 0,
  //           TokenList = []
    const path = `/swap/previewExactIn?chain=${chain}&protocol=${protocol}&tokenIn=${tokenIn}&tokenOut=${tokenOut}&amountIn=${amountIn}&TokenList=${TokenList}`;
      const data = await apiGet(path);
     return data;
    //   return {
    //   amountIn: amountIn,
    //   amountOut: amountsOut[amountsOut.length - 1].toString(),
    //   fee: fee.toString(),
    //   path,
    // };
}

export async function previewExactOut({ chain, protocol, tokenIn, tokenOut, amountOut: val, TokenList: tokenList }){
    const path = `/swap/previewExactOut?`;
      const data = await apiGet(path);
}

export async function swapExactIn({ chain, protocol, path, amountIn, isNative }){
    const path1 = `/swap/ExactIn?`;
      const data = await apiGet(path);
}


export async function swapExactOut({ chain, protocol, path, amountOut, isNative }){
    const path1 = `/swap/ExactOut?`;
      const data = await apiGet(path);
}