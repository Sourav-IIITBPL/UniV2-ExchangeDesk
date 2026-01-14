pragma solidity ^0.8.20;
import "forge-std/Test.sol";
import "../../src/ExchangeDeskRouter.sol";
import "../mocks/MockFeeOnTransferERC20.sol";
import "../mocks/MockERC20.sol";
import "../mocks/MockRouter.sol";

contract FeeOnTransferTest is Test {
    ExchangeDeskRouter r;
    MockFeeOnTransferERC20 fot;
    MockERC20 B;
    address user = address(1);

    function setUp() public {
        fot = new MockFeeOnTransferERC20();
        B = new MockERC20("B","B");
        r = new ExchangeDeskRouter(address(new MockRouter()), address(1), address(2), address(9));

        fot.mint(user, 1e24);
        vm.prank(user); fot.approve(address(r), type(uint).max);
    }

    function test_noSlippageRevert() public {
        address;
        p[0]=address(fot); p[1]=address(B);

        vm.prank(user);
        r.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            1e20, 0, p, user, block.timestamp+10
        );
    }
}
