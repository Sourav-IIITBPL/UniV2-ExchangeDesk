// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../BaseForkSetup.sol";

contract LiquidityFuzz is BaseForkSetup {
    function test_fuzz_addLiquidity(uint96 amt) public {
        vm.assume(amt > 1e6);
        vm.assume(amt < 20_000e6);
        vm.prank(user);
        desk.addLiquidity(USDC, DAI, amt, amt * 1e12, 0, 0, user, block.timestamp + 300);
    }
}
