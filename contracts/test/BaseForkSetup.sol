// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

import "../src/ExchangeDeskRouter.sol";
import "../src/interfaces/IUniswapV2Factory.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract BaseForkSetup is Test {
    // ===== Mainnet addresses =====
    address constant UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    address constant UNISWAP_V2_FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    address constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    address constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    address constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;

    ExchangeDeskRouter desk;

    address feeRecipient = address(0xBEEF);
    address user;

    function setUp() public virtual {
        vm.createSelectFork(vm.rpcUrl("mainnet"));

        user = makeAddr("user");

        desk = new ExchangeDeskRouter(UNISWAP_V2_ROUTER, UNISWAP_V2_FACTORY, WETH, feeRecipient);

        // Fund user
        deal(USDC, user, 200_000e6);
        deal(DAI, user, 200_000e18);
        deal(user, 100 ether);

        vm.startPrank(user);
        IERC20(USDC).approve(address(desk), type(uint256).max);
        IERC20(DAI).approve(address(desk), type(uint256).max);
        vm.stopPrank();
    }
}
