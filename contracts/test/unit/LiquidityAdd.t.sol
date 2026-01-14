// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../BaseForkSetup.sol";

contract LiquidityAdd_Unit is BaseForkSetup {
    function test_addLiquidity_feeOnBothTokens() public {
        uint256 feeA = IERC20(USDC).balanceOf(feeRecipient);
        uint256 feeB = IERC20(DAI).balanceOf(feeRecipient);
        vm.prank(user);
        desk.addLiquidity(USDC, DAI, 1_000e6, 1_000e18, 0, 0, user, block.timestamp + 300);

        assertGt(IERC20(USDC).balanceOf(feeRecipient), feeA);
        assertGt(IERC20(DAI).balanceOf(feeRecipient), feeB);
    }

    function test_addLiquidityETH_feeOnTokenAndETH() public {
        uint256 feeBefore = feeRecipient.balance;
        vm.prank(user);
        desk.addLiquidityETH{value: 1 ether}(USDC, 1_000e6, 0, 0, user, block.timestamp + 300);

        assertGt(feeRecipient.balance, feeBefore);
    }
}
