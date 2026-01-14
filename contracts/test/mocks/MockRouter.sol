pragma solidity ^0.8.20;

contract MockRouter {
    function getAmountsOut(uint256 inAmt, address[] calldata) external pure returns (uint256[] memory a) {
        a = new uint256[](2);
        a[0] = inAmt;
        a[1] = inAmt * 2;
    }

    function getAmountsIn(uint256 outAmt, address[] calldata) external pure returns (uint256[] memory a) {
        a = new uint256[](2);
        a[0] = outAmt / 2;
        a[1] = outAmt;
    }

    function swapExactTokensForTokens(uint256 inAmt, uint256, address[] calldata, address, uint256)
        external
        returns (uint256[] memory a)
    {
        a = new uint256[](2);
        a[0] = inAmt;
        a[1] = inAmt * 2;
    }
}
