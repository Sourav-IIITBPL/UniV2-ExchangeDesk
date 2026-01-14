pragma solidity ^0.8.20;
import "forge-std/Test.sol";
import "../../src/ExchangeDeskRouter.sol";

contract DeadlineSlippageTest is Test {
    function test_deadlineExpiredReverts() public {
        ExchangeDeskRouter r =
            new ExchangeDeskRouter(address(1),address(2),address(3),address(4));

        address;
        p[0]=address(5); p[1]=address(6);

        vm.expectRevert(ExchangeDeskRouter.InvalidDeadline.selector);
        r.swapExactTokensForTokens(1,0,p,address(7),block.timestamp-1);
    }
}
