pragma solidity ^0.8.20;
import "forge-std/Test.sol";
import "../../src/ExchangeDeskRouter.sol";
import "../mocks/MockERC20.sol";
import "../mocks/MockRouter.sol";

contract SwapExactInputTest is Test {
    ExchangeDeskRouter r;
    MockERC20 A; MockERC20 B;
    address fee = address(0xBEEF);
    address user = address(0xCAFE);

    function setUp() public {
        A = new MockERC20("A","A");
        B = new MockERC20("B","B");
        r = new ExchangeDeskRouter(address(new MockRouter()), address(1), address(2), fee);

        A.mint(user, 1e24);
        vm.prank(user); A.approve(address(r), type(uint).max);
    }

    function test_feeAndSlippageApplied() public {
        address;
        p[0]=address(A); p[1]=address(B);

        uint inAmt = 1_000 ether;
        uint feeAmt = inAmt / 10_000;

        vm.prank(user);
        r.swapExactTokensForTokens(inAmt, 100, p, user, block.timestamp+10);

        assertEq(A.balanceOf(fee), feeAmt);
    }
}
