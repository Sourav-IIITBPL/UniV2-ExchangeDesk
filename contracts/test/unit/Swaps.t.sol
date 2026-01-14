// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../BaseForkSetup.sol";

contract Swaps_Unit is BaseForkSetup {
    function test_swapExactTokensForTokens() public {
        address[] memory path = new address[](2);
        path[0] = USDC;
        path[1] = DAI;

        uint256 feeBefore = IERC20(USDC).balanceOf(feeRecipient);
        vm.prank(user);
        desk.swapExactTokensForTokens(1_000e6, 100, path, user, block.timestamp + 300);

        assertGt(IERC20(USDC).balanceOf(feeRecipient), feeBefore);
    }

    function test_swapExactTokensForETH() public {
        address[] memory path = new address[](2);
        path[0] = USDC;
        path[1] = WETH;
        vm.prank(user);
        desk.swapExactTokensForETH(1_000e6, 200, path, user, block.timestamp + 300);
    }

    function test_swapExactETHForTokens() public {
        address[] memory path = new address[](2);
        path[0] = WETH;
        path[1] = DAI;
        vm.prank(user);
        desk.swapExactETHForTokens{value: 1 ether}(200, path, user, block.timestamp + 300);
    }
}
