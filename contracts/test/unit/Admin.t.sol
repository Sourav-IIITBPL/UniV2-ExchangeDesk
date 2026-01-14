pragma solidity ^0.8.20;
import "forge-std/Test.sol";
import "../../src/ExchangeDeskRouter.sol";

contract AdminTest is Test {
    function test_setFeeBpsRevert() public {
        ExchangeDeskRouter r =
            new ExchangeDeskRouter(address(1),address(2),address(3),address(4));

        vm.expectRevert(ExchangeDeskRouter.FeeTooHigh.selector);
        r.setFeeBps(2);
    }
}
