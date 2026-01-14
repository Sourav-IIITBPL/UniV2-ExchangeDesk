// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SetupForkUniswapV2.sol";

contract LiquidityIntegrationTest is SetupForkUniswapV2 {
    function test_addLiquidity_chargesFeeOnBothTokens() public {
        uint feeBeforeUSDC = IERC20(USDC).balanceOf(feeRecipient);
        uint feeBeforeDAI = IERC20(DAI).balanceOf(feeRecipient);

        desk.addLiquidity(
            USDC,
            DAI,
            1_000e6,
            1_000e18,
            0,
            0,
            user,
            block.timestamp + 300
        );

        assertGt(IERC20(USDC).balanceOf(feeRecipient), feeBeforeUSDC);
        assertGt(IERC20(DAI).balanceOf(feeRecipient), feeBeforeDAI);
    }
}
