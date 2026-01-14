// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../BaseForkSetup.sol";
import "../../src/interfaces/IUniswapV2Pair.sol";

contract FullFlow_IT is BaseForkSetup {
    function test_swap_add_remove_flow() public {
        address[] memory path = new address[](2);
        path[0] = USDC;
        path[1] = DAI;
        vm.prank(user);
        desk.swapExactTokensForTokens(2_000e6, 200, path, user, block.timestamp + 300);
        vm.prank(user);
        desk.addLiquidity(USDC, DAI, 1_000e6, 1_000e18, 0, 0, user, block.timestamp + 300);

        address pair = IUniswapV2Factory(UNISWAP_V2_FACTORY).getPair(USDC, DAI);

        uint256 lp = IERC20(pair).balanceOf(user);
        vm.prank(user);
        IERC20(pair).approve(address(desk), lp);
        vm.prank(user);
        desk.removeLiquidity(USDC, DAI, lp, 0, 0, user, block.timestamp + 300);
    }
}
