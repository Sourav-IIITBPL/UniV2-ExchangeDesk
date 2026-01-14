// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*//////////////////////////////////////////////////////////////
                        EXCHANGE DESK ROUTER
                        (UNISWAP V2 BASED)
//////////////////////////////////////////////////////////////*/

interface IExchangeDeskRouter {
    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error ZeroAddress();
    error SameToken();
    error InvalidPath();
    error InvalidDeadline();
    error ExcessiveInputAmount();
    error ExcessiveSlippage();
    error FeeTooHigh();
    error ETHTransferFailed();
    error PairDoesNotExist();

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event FeeRecipientUpdated(address indexed oldRecipient, address indexed newRecipient);
    event FeeBpsUpdated(uint256 indexed oldFeeBps, uint256 indexed newFeeBps);

    /*//////////////////////////////////////////////////////////////
                                VIEW
    //////////////////////////////////////////////////////////////*/

    function uniswapRouter() external view returns (address);
    function uniswapFactory() external view returns (address);
    function WETH() external view returns (address);

    function feeRecipient() external view returns (address);
    function feeBps() external view returns (uint256);

    function BPS_DENOMINATOR() external pure returns (uint256);
    function MAX_FEE_BPS() external pure returns (uint256);
    function MAX_SLIPPAGE_BPS() external pure returns (uint256);
    function MAX_DEADLINE_WINDOW() external pure returns (uint64);

    /*//////////////////////////////////////////////////////////////
                                ADMIN
    //////////////////////////////////////////////////////////////*/

    function setFeeRecipient(address newRecipient) external;
    function setFeeBps(uint256 newFeeBps) external;

    /*//////////////////////////////////////////////////////////////
                        EXACT INPUT SWAPS
                        (SLIPPAGE APPLIED)
    //////////////////////////////////////////////////////////////*/

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 slippageBPS,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactETHForTokens(uint256 slippageBPS, address[] calldata path, address to, uint256 deadline)
        external
        payable
        returns (uint256[] memory amounts);

    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 slippageBPS,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    /*//////////////////////////////////////////////////////////////
                        EXACT OUTPUT SWAPS
                        (SLIPPAGE APPLIED ON INPUT)
    //////////////////////////////////////////////////////////////*/

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 slippageBPS,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapETHForExactTokens(
        uint256 amountOut,
        uint256 slippageBPS,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function swapTokensForExactETH(
        uint256 amountOut,
        uint256 slippageBPS,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    /*//////////////////////////////////////////////////////////////
                    FEE-ON-TRANSFER SWAPS
                    (NO INTERNAL SLIPPAGE)
    //////////////////////////////////////////////////////////////*/

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;

    /*//////////////////////////////////////////////////////////////
                        LIQUIDITY (FEES ON ADD)
                        (NO SLIPPAGE LOGIC INSIDE)
    //////////////////////////////////////////////////////////////*/

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity);

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity);

    /*//////////////////////////////////////////////////////////////
                        REMOVE LIQUIDITY
                        (NO FEES)
    //////////////////////////////////////////////////////////////*/

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB);

    function removeLiquidityETH(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountToken, uint256 amountETH);

    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountETH);

    /*//////////////////////////////////////////////////////////////
                        VIEW HELPERS
                        (PASS-THROUGH)
    //////////////////////////////////////////////////////////////*/

    function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) external pure returns (uint256 amountB);

    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)
        external
        pure
        returns (uint256 amountOut);

    function getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut)
        external
        pure
        returns (uint256 amountIn);

    function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts);

    function getAmountsIn(uint256 amountOut, address[] calldata path) external view returns (uint256[] memory amounts);

    /*//////////////////////////////////////////////////////////////
                        PAIR CREATION
    //////////////////////////////////////////////////////////////*/

    function createPairIfNotExists(address tokenA, address tokenB) external returns (address pair);
}
