pragma solidity ^0.8.20;
import "forge-std/Test.sol";
import "../../src/ExchangeDeskRouter.sol";
import "../mocks/MockERC20.sol";
import "../mocks/MockRouter.sol";

contract AddLiquidityTest is Test {
    ExchangeDeskRouter r;
    MockERC20 A; MockERC20 B;
    address fee = address(9);
    address user = address(1);

    function setUp() public {
        A = new MockERC20("A","A");
        B = new MockERC20("B","B");
        r = new ExchangeDeskRouter(address(new MockRouter()), address(1), address(2), fee);

        A.mint(user, 1e24);
        B.mint(user, 1e24);
        vm.startPrank(user);
        A.approve(address(r), type(uint).max);
        B.approve(address(r), type(uint).max);
        vm.stopPrank();
    }

    function test_dualFeeTaken() public {
        vm.prank(user);
        r.addLiquidity(address(A), address(B), 1000 ether, 2000 ether, 0, 0, user, block.timestamp+10);

        assertEq(A.balanceOf(fee), 1000 ether / 10_000);
        assertEq(B.balanceOf(fee), 2000 ether / 10_000);
    }
}
