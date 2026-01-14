pragma solidity ^0.8.20;

contract MockRouter {
    function getAmountsOut(uint inAmt, address[] calldata)
        external pure returns (uint[] memory a)
    {
        a = new uint;
        a[0] = inAmt;
        a[1] = inAmt * 2;
    }

    function getAmountsIn(uint outAmt, address[] calldata)
        external pure returns (uint[] memory a)
    {
        a = new uint;
        a[0] = outAmt / 2;
        a[1] = outAmt;
    }

    function swapExactTokensForTokens(
        uint inAmt, uint, address[] calldata, address, uint
    ) external returns (uint[] memory a) {
        a = new uint;
        a[0] = inAmt;
        a[1] = inAmt * 2;
    }
}
