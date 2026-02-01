import { getExactTokenInSwapQuote, getExactTokenOutSwapQuote } from "../services/swap.service.js";
import { getExactTokenInSwap, getExactTokenOutSwap} from "../services/swap.service.js";


export async function getpreviewExactInSwap(req, res, next) {
    try {

        const {
            chain = "ethereum",
            protocol = "uniswap",
            tokenIn = 0x00,
            tokenOut = 0x00,
            amountIn = 0,
            TokenList = []
        } = req.query;

        const preview = await getExactTokenInSwapQuote(chain,protocol,tokenIn,tokenOut,amountIn,TokenList);

        res.json(preview);
    } catch (err) {
        next(err);
    }
}


export async function getpreviewExactOutSwap(req, res, next) {
    try {

        const {
            chain = "ethereum",
            protocol = "uniswap",
            tokenIn = 0x00,
            tokenOut = 0x00,
            amountOut = 0,
            TokenList = []
        } = req.query;

        const preview = await getExactTokenOutSwapQuote(chain,protocol,tokenIn,tokenOut,amountOut,TokenList);

        res.json(preview);
    } catch (err) {
        next(err);
    }
}


export async function getExactInSwap(req, res, next) {
    try {

        const {
            chain = "ethereum",
            protocol = "uniswap",
            amountIn = 0,
            slippage = 0,
            path = [],
            deadline = Math.floor(Date.now() / 1000) + 60 * 15
        } = req.query;

        const swap = await getExactTokenInSwap(chain,protocol,amountIn,slippage,path,deadline);

        res.json(swap);
    } catch (err) {
        next(err);
    }
}



export async function getExactOutSwap(req, res, next) {
    try {

        const {
            chain = "ethereum",
            protocol = "uniswap",
            tokenIn = 0x00,
            tokenOut = 0x00,
            slippage = 0,
            amountOut = 0,
            deadline = Math.floor(Date.now() / 1000) + 60 * 15
        } = req.query;

        const swap = await getExactTokenOutSwap(chain,protocol,tokenIn,tokenOut,slippage,amountOut,deadline);

        res.json(swap);
    } catch (err) {
        next(err);
    }
}