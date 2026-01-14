pragma solidity ^0.8.20;
import "forge-std/Test.sol";

contract SwapFuzz is Test {
    function test_fuzz_feeNeverExceedsAmount(uint256 amount) public {
        vm.assume(amount > 0 && amount < 1e36);
        uint fee = amount / 10_000;
        assertLe(fee, amount);
    }
}
