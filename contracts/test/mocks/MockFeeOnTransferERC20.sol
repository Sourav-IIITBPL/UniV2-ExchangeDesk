pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockFeeOnTransferERC20 is ERC20 {
    uint256 public constant FEE_BPS = 500; // 5%
    constructor() ERC20("FOT", "FOT") {}
    function mint(address to, uint amt) external { _mint(to, amt); }

    function _transfer(address f, address t, uint a) internal override {
        uint fee = (a * FEE_BPS) / 10_000;
        super._transfer(f, address(0xdead), fee);
        super._transfer(f, t, a - fee);
    }
}
