// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

contract DeadlineFuzz is Test {
    function test_fuzz_deadline(uint256 delta) public {
        vm.assume(delta <= 20 minutes);
        uint deadline = block.timestamp + delta;
        assertTrue(deadline >= block.timestamp);
    }
}
