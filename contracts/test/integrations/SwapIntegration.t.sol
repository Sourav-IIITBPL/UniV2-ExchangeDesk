// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SetupForkUniswapV2.sol";

contract SwapIntegrationTest is SetupForkUniswapV2 {
    function test_swapExactTokensForTokens_realPool() public {
        address;
        path[0] = USDC;
        path[1] = DAI;

        uint daiBefore = IERC20(DAI).balanceOf(user);
        uint feeBefore = IERC20(USDC).balanceOf(feeRecipient);

        desk.swapExactTokensForTokens(
            1_000e6, // 1000 USDC
            100,     // 1% slippage
            path,
            user,
            block.timestamp + 300
        );

        assertGt(IERC20(DAI).balanceOf(user), daiBefore);
        assertGt(IERC20(USDC).balanceOf(feeRecipient), feeBefore);
    }
}
