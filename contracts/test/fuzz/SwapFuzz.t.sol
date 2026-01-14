// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../BaseForkSetup.sol";

contract SwapFuzz is BaseForkSetup {
    function test_fuzz_swapExact(uint96 amount) public {
        vm.assume(amount > 10e6);
        vm.assume(amount < 50_000e6);

        address[] memory path = new address[](2);
        path[0] = USDC;
        path[1] = DAI;
        vm.prank(user);
        desk.swapExactTokensForTokens(amount, 300, path, user, block.timestamp + 300);
    }
}
