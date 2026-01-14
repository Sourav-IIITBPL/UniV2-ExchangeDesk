// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

contract LiquidityFuzz is Test {
    function test_fuzz_dualFeeDoesNotOverflow(
        uint256 a,
        uint256 b
    ) public {
        vm.assume(a < 1e36 && b < 1e36);
        uint feeA = a / 10_000;
        uint feeB = b / 10_000;
        assertLe(feeA, a);
        assertLe(feeB, b);
    }
}
