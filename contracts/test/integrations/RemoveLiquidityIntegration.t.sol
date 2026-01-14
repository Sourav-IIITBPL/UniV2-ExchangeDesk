// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SetupForkUniswapV2.sol";
import "../../src/interfaces/IUniswapV2Pair.sol";

contract RemoveLiquidityIntegrationTest is SetupForkUniswapV2 {
    function test_removeLiquidity_noFeeTaken() public {
        // First add liquidity
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

        address pair =
            IUniswapV2Factory(UNISWAP_V2_FACTORY).getPair(USDC, DAI);

        uint lpBalance = IERC20(pair).balanceOf(user);

        uint feeBeforeUSDC = IERC20(USDC).balanceOf(feeRecipient);
        uint feeBeforeDAI = IERC20(DAI).balanceOf(feeRecipient);

        IERC20(pair).approve(address(desk), lpBalance);

        desk.removeLiquidity(
            USDC,
            DAI,
            lpBalance / 2,
            0,
            0,
            user,
            block.timestamp + 300
        );

        // No fee on remove
        assertEq(IERC20(USDC).balanceOf(feeRecipient), feeBeforeUSDC);
        assertEq(IERC20(DAI).balanceOf(feeRecipient), feeBeforeDAI);
    }
}
