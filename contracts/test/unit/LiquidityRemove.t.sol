// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../BaseForkSetup.sol";
import "../../src/interfaces/IUniswapV2Pair.sol";

contract LiquidityRemove_Unit is BaseForkSetup {
    function test_removeLiquidity_noFees() public {
        vm.prank(user);
        desk.addLiquidity(USDC, DAI, 1_000e6, 1_000e18, 0, 0, user, block.timestamp + 300);

        address pair = IUniswapV2Factory(UNISWAP_V2_FACTORY).getPair(USDC, DAI);

        uint256 lp = IERC20(pair).balanceOf(user);
        vm.prank(user);
        IERC20(pair).approve(address(desk), lp);

        uint256 feeBefore = IERC20(USDC).balanceOf(feeRecipient);
        vm.prank(user);
        desk.removeLiquidity(USDC, DAI, lp, 0, 0, user, block.timestamp + 300);

        assertEq(IERC20(USDC).balanceOf(feeRecipient), feeBefore);
    }
}
