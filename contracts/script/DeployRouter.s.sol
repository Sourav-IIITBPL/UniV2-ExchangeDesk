// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "forge-std/Script.sol";
import "../src/ExchangeDeskRouter.sol";

contract DeployExchangeDeskRouter is Script {
    function run() external {
        // Load deployer private key
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");

        // Sepolia addresses
        address factory = vm.envAddress("FACTORY_ADDRESS");
        address weth = vm.envAddress("WETH_ADDRESS");
        address router = vm.envAddress("ROUTER_ADDRESS");
        address feeRecipient = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        ExchangeDeskRouter exchangeDeskRouter = new ExchangeDeskRouter(router,factory,weth,feeRecipient);

        vm.stopBroadcast();

        console.log("ExchangeDeskRouter deployed at:", address(exchangeDeskRouter));
        console.log("Fee recipient:", feeRecipient);
    }
}
