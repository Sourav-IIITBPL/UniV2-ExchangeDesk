// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockFeeOnTransferERC20 is ERC20 {
    uint256 public constant FEE_BPS = 500; // 5%

    constructor() ERC20("FeeOnTransfer", "FOT") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    // OZ v5: override _update, NOT _transfer
    function _update(address from, address to, uint256 amount) internal override {
        if (from != address(0) && to != address(0)) {
            uint256 fee = (amount * FEE_BPS) / 10_000;
            uint256 net = amount - fee;

            super._update(from, address(0xdead), fee);
            super._update(from, to, net);
        } else {
            super._update(from, to, amount);
        }
    }
}

