pragma solidity ^0.8.20;
import "forge-std/Test.sol";
import "../../src/ExchangeDeskRouter.sol";
import "../mocks/MockERC20.sol";
import "../mocks/MockRouter.sol";

contract SwapExactOutputTest is Test {
    ExchangeDeskRouter r;
    MockERC20 A; MockERC20 B;
    address user = address(1);

    function setUp() public {
        A = new MockERC20("A","A");
        B = new MockERC20("B","B");
        r = new ExchangeDeskRouter(address(new MockRouter()), address(1), address(2), address(9));

        A.mint(user, 1e24);
        vm.prank(user); A.approve(address(r), type(uint).max);
    }

    function test_refundOccurs() public {
        address;
        p[0]=address(A); p[1]=address(B);

        uint balBefore = A.balanceOf(user);

        vm.prank(user);
        r.swapTokensForExactTokens(100 ether, 100, p, user, block.timestamp+10);

        assertGt(A.balanceOf(user), balBefore - 1e20);
    }
}
