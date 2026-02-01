// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {IUniswapV2Router02} from "./interfaces/IUniswapV2Router02.sol";
import {IUniswapV2Factory} from "./interfaces/IUniswapV2Factory.sol";
import {IUniswapV2Pair} from "./interfaces/IUniswapV2Pair.sol";
import {IWETH} from "./interfaces/IWETH.sol";

/*//////////////////////////////////////////////////////////////
                    EXCHANGE DESK ROUTER
//////////////////////////////////////////////////////////////*/

contract ExchangeDeskRouter is Ownable, ReentrancyGuard {
    uint256 public constant BPS_DENOMINATOR = 10_000;
    uint256 public constant MAX_FEE_BPS = 1; // 0.01%
    uint256 public constant MAX_SLIPPAGE_BPS = 500; // 5%
    uint64 public constant MAX_DEADLINE_WINDOW = 20 minutes;

    IUniswapV2Router02 public immutable uniswapRouter;
    IUniswapV2Factory public immutable uniswapFactory;
    address public immutable WETH;

    address public feeRecipient;
    uint256 public feeBps = 1; // 0.01%

    error ZeroAddress();
    error SameToken();
    error InvalidPath();
    error InvalidDeadline();
    error ExcessiveInputAmount();
    error ExcessiveSlippage();
    error FeeTooHigh();
    error ETHTransferFailed();
    error PairDoesNotExist();

    constructor(address _router, address _factory, address _weth, address _feeRecipient) Ownable(msg.sender) {
        if (_router == address(0) || _factory == address(0) || _weth == address(0) || _feeRecipient == address(0)) {
            revert ZeroAddress();
        }

        uniswapRouter = IUniswapV2Router02(_router);
        uniswapFactory = IUniswapV2Factory(_factory);
        WETH = _weth;
        feeRecipient = _feeRecipient;
    }

    /*//////////////////////////////////////////////////////////////
                        INTERNAL HELPERS
    //////////////////////////////////////////////////////////////*/

    function _validateDeadline(uint256 deadline) internal view {
        if (deadline < block.timestamp || deadline > block.timestamp + MAX_DEADLINE_WINDOW) {
            revert InvalidDeadline();
        }
    }

    function _validateSlippage(uint256 slippageBPS) internal view {
        if (slippageBPS > MAX_SLIPPAGE_BPS) revert ExcessiveSlippage();
    }

    function _validatePath(address[] calldata path) internal view {
        if (path.length < 2) revert InvalidPath();
        if (path[0] == path[path.length - 1]) revert SameToken();
    }

    /*//////////////////////////////////////////////////////////////
                        ADMIN
    //////////////////////////////////////////////////////////////*/

    function setFeeRecipient(address r) external onlyOwner {
        if (r == address(0)) revert ZeroAddress();
        feeRecipient = r;
    }

    function setFeeBps(uint256 bps) external onlyOwner {
        if (bps > MAX_FEE_BPS) revert FeeTooHigh();
        feeBps = bps;
    }

    /*//////////////////////////////////////////////////////////////
                        EXACT INPUT SWAPS (WITH SLIPPAGE)
    //////////////////////////////////////////////////////////////*/

    /// @notice Swap exact tokens for tokens with slippage protection
    /// @param slippageBPS Slippage tolerance in basis points (e.g., 50 = 0.5%)
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 slippageBPS,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external nonReentrant returns (uint256[] memory amounts) {
        _validateDeadline(deadline);
        _validateSlippage(slippageBPS);
        _validatePath(path);

        address tokenIn = path[0];
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        uint256 fee = (amountIn * feeBps) / BPS_DENOMINATOR;
        uint256 net = amountIn - fee;
        if (fee > 0) IERC20(tokenIn).transfer(feeRecipient, fee);

        // Calculate minimum output with slippage protection
        uint256[] memory q = uniswapRouter.getAmountsOut(net, path);
        uint256 minOut = (q[q.length - 1] * (BPS_DENOMINATOR - slippageBPS)) / BPS_DENOMINATOR;

        IERC20(tokenIn).approve(address(uniswapRouter), net);
        amounts = uniswapRouter.swapExactTokensForTokens(net, minOut, path, to, deadline);
    }

    /// @notice Swap exact ETH for tokens with slippage protection
    function swapExactETHForTokens(uint256 slippageBPS, address[] calldata path, address to, uint256 deadline)
        external
        payable
        nonReentrant
        returns (uint256[] memory amounts)
    {
        _validateDeadline(deadline);
        _validateSlippage(slippageBPS);
        _validatePath(path);
        if (path[0] != WETH) revert InvalidPath();

        uint256 fee = (msg.value * feeBps) / BPS_DENOMINATOR;
        uint256 net = msg.value - fee;

        if (fee > 0) {
            (bool ok,) = feeRecipient.call{value: fee}("");
            if (!ok) revert ETHTransferFailed();
        }

        // Calculate minimum output with slippage protection
        uint256[] memory q = uniswapRouter.getAmountsOut(net, path);
        uint256 minOut = (q[q.length - 1] * (BPS_DENOMINATOR - slippageBPS)) / BPS_DENOMINATOR;

        amounts = uniswapRouter.swapExactETHForTokens{value: net}(minOut, path, to, deadline);
    }

    /// @notice Swap exact tokens for ETH with slippage protection
    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 slippageBPS,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external nonReentrant returns (uint256[] memory amounts) {
        _validateDeadline(deadline);
        _validateSlippage(slippageBPS);
        _validatePath(path);
        if (path[path.length - 1] != WETH) revert InvalidPath();

        address tokenIn = path[0];
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        uint256 fee = (amountIn * feeBps) / BPS_DENOMINATOR;
        uint256 net = amountIn - fee;
        if (fee > 0) IERC20(tokenIn).transfer(feeRecipient, fee);

        // Calculate minimum output with slippage protection
        uint256[] memory q = uniswapRouter.getAmountsOut(net, path);
        uint256 minOut = (q[q.length - 1] * (BPS_DENOMINATOR - slippageBPS)) / BPS_DENOMINATOR;

        IERC20(tokenIn).approve(address(uniswapRouter), net);
        amounts = uniswapRouter.swapExactTokensForETH(net, minOut, path, to, deadline);
    }

    /*//////////////////////////////////////////////////////////////
                    EXACT OUTPUT SWAPS (WITH SLIPPAGE)
    //////////////////////////////////////////////////////////////*/

    /// @notice Swap tokens for exact tokens with slippage protection on input
    /// @param slippageBPS Maximum additional input tolerance in basis points
    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 slippageBPS,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external nonReentrant returns (uint256[] memory amounts) {
        _validateDeadline(deadline);
        _validateSlippage(slippageBPS);
        _validatePath(path);

        address tokenIn = path[0];

        // Get exact amounts needed
        uint256[] memory q = uniswapRouter.getAmountsIn(amountOut, path);
        uint256 amountInNeeded = q[0];

        // Add fee on top
        uint256 fee = (amountInNeeded * feeBps) / BPS_DENOMINATOR;
        uint256 totalNeeded = amountInNeeded + fee;

        // Apply slippage tolerance to max input
        uint256 maxInput = (totalNeeded * (BPS_DENOMINATOR + slippageBPS)) / BPS_DENOMINATOR;

        IERC20(tokenIn).transferFrom(msg.sender, address(this), maxInput);

        if (fee > 0) IERC20(tokenIn).transfer(feeRecipient, fee);

        IERC20(tokenIn).approve(address(uniswapRouter), maxInput - fee);
        amounts = uniswapRouter.swapTokensForExactTokens(amountOut, maxInput - fee, path, to, deadline);

        // Refund excess
        uint256 actualUsed = amounts[0] + fee;
        if (maxInput > actualUsed) {
            IERC20(tokenIn).transfer(msg.sender, maxInput - actualUsed);
        }
    }

    /// @notice Swap ETH for exact tokens with slippage protection on input
    function swapETHForExactTokens(
        uint256 amountOut,
        uint256 slippageBPS,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable nonReentrant returns (uint256[] memory amounts) {
        _validateDeadline(deadline);
        _validateSlippage(slippageBPS);
        _validatePath(path);
        if (path[0] != WETH) revert InvalidPath();

        // Get exact ETH needed
        uint256[] memory q = uniswapRouter.getAmountsIn(amountOut, path);
        uint256 ethNeeded = q[0];

        // Add fee on top
        uint256 fee = (ethNeeded * feeBps) / BPS_DENOMINATOR;
        uint256 totalNeeded = ethNeeded + fee;

        // Apply slippage tolerance
        uint256 maxETH = (totalNeeded * (BPS_DENOMINATOR + slippageBPS)) / BPS_DENOMINATOR;
        if (msg.value < maxETH) revert ExcessiveInputAmount();

        if (fee > 0) {
            (bool ok,) = feeRecipient.call{value: fee}("");
            if (!ok) revert ETHTransferFailed();
        }

        amounts = uniswapRouter.swapETHForExactTokens{value: msg.value - fee}(amountOut, path, to, deadline);

        // Refund excess ETH
        uint256 actualUsed = amounts[0] + fee;
        if (msg.value > actualUsed) {
            (bool ok,) = msg.sender.call{value: msg.value - actualUsed}("");
            if (!ok) revert ETHTransferFailed();
        }
    }

    /// @notice Swap tokens for exact ETH with slippage protection on input
    function swapTokensForExactETH(
        uint256 amountOut,
        uint256 slippageBPS,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external nonReentrant returns (uint256[] memory amounts) {
        _validateDeadline(deadline);
        _validateSlippage(slippageBPS);
        _validatePath(path);
        if (path[path.length - 1] != WETH) revert InvalidPath();

        address tokenIn = path[0];

        // Get exact amounts needed
        uint256[] memory q = uniswapRouter.getAmountsIn(amountOut, path);
        uint256 amountInNeeded = q[0];

        // Add fee on top
        uint256 fee = (amountInNeeded * feeBps) / BPS_DENOMINATOR;
        uint256 totalNeeded = amountInNeeded + fee;

        // Apply slippage tolerance to max input
        uint256 maxInput = (totalNeeded * (BPS_DENOMINATOR + slippageBPS)) / BPS_DENOMINATOR;

        IERC20(tokenIn).transferFrom(msg.sender, address(this), maxInput);

        if (fee > 0) IERC20(tokenIn).transfer(feeRecipient, fee);

        IERC20(tokenIn).approve(address(uniswapRouter), maxInput - fee);
        amounts = uniswapRouter.swapTokensForExactETH(amountOut, maxInput - fee, path, to, deadline);

        // Refund excess
        uint256 actualUsed = amounts[0] + fee;
        if (maxInput > actualUsed) {
            IERC20(tokenIn).transfer(msg.sender, maxInput - actualUsed);
        }
    }

    /*//////////////////////////////////////////////////////////////
                    FEE-ON-TRANSFER SWAPS (NO SLIPPAGE)
                    (User provides amountOutMin directly)
    //////////////////////////////////////////////////////////////*/

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external nonReentrant {
        _validateDeadline(deadline);
        _validatePath(path);

        address tokenIn = path[0];
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        uint256 fee = (amountIn * feeBps) / BPS_DENOMINATOR;
        uint256 net = amountIn - fee;
        if (fee > 0) IERC20(tokenIn).transfer(feeRecipient, fee);

        IERC20(tokenIn).approve(address(uniswapRouter), net);
        uniswapRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(net, amountOutMin, path, to, deadline);
    }

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable nonReentrant {
        _validateDeadline(deadline);
        _validatePath(path);
        if (path[0] != WETH) revert InvalidPath();

        uint256 fee = (msg.value * feeBps) / BPS_DENOMINATOR;
        uint256 net = msg.value - fee;

        if (fee > 0) {
            (bool ok,) = feeRecipient.call{value: fee}("");
            if (!ok) revert ETHTransferFailed();
        }

        uniswapRouter.swapExactETHForTokensSupportingFeeOnTransferTokens{value: net}(amountOutMin, path, to, deadline);
    }

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external nonReentrant {
        _validateDeadline(deadline);
        _validatePath(path);
        if (path[path.length - 1] != WETH) revert InvalidPath();

        address tokenIn = path[0];
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        uint256 fee = (amountIn * feeBps) / BPS_DENOMINATOR;
        uint256 net = amountIn - fee;
        if (fee > 0) IERC20(tokenIn).transfer(feeRecipient, fee);

        IERC20(tokenIn).approve(address(uniswapRouter), net);
        uniswapRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(net, amountOutMin, path, to, deadline);
    }

    /*//////////////////////////////////////////////////////////////
                        LIQUIDITY (FEES ON BOTH TOKENS)
                        (Slippage via amountMin parameters)
    //////////////////////////////////////////////////////////////*/

    /// @notice addLiquidity with fee on BOTH tokenA and tokenB
    /// @dev Slippage protection via amountAMin and amountBMin
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external nonReentrant returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        _validateDeadline(deadline);
        if (tokenA == tokenB) revert SameToken();

        IERC20(tokenA).transferFrom(msg.sender, address(this), amountADesired);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountBDesired);

        // Calculate fees for both tokens
        uint256 feeA = (amountADesired * feeBps) / BPS_DENOMINATOR;
        uint256 feeB = (amountBDesired * feeBps) / BPS_DENOMINATOR;
        uint256 netA = amountADesired - feeA;
        uint256 netB = amountBDesired - feeB;

        // Transfer fees
        if (feeA > 0) IERC20(tokenA).transfer(feeRecipient, feeA);
        if (feeB > 0) IERC20(tokenB).transfer(feeRecipient, feeB);

        IERC20(tokenA).approve(address(uniswapRouter), netA);
        IERC20(tokenB).approve(address(uniswapRouter), netB);

        (amountA, amountB, liquidity) =
            uniswapRouter.addLiquidity(tokenA, tokenB, netA, netB, amountAMin, amountBMin, to, deadline);

        // Refund excess
        if (netA > amountA) IERC20(tokenA).transfer(msg.sender, netA - amountA);
        if (netB > amountB) IERC20(tokenB).transfer(msg.sender, netB - amountB);
    }

    /// @notice addLiquidityETH with fee on BOTH ETH and token
    /// @dev Slippage protection via amountTokenMin and amountETHMin
    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external payable nonReentrant returns (uint256 amountToken, uint256 amountETH, uint256 liquidity) {
        _validateDeadline(deadline);

        // Calculate fees for both ETH and token
        uint256 feeETH = (msg.value * feeBps) / BPS_DENOMINATOR;
        uint256 feeToken = (amountTokenDesired * feeBps) / BPS_DENOMINATOR;
        uint256 netETH = msg.value - feeETH;
        uint256 netToken = amountTokenDesired - feeToken;

        // Transfer ETH fee
        if (feeETH > 0) {
            (bool ok,) = feeRecipient.call{value: feeETH}("");
            if (!ok) revert ETHTransferFailed();
        }

        IERC20(token).transferFrom(msg.sender, address(this), amountTokenDesired);

        // Transfer token fee
        if (feeToken > 0) IERC20(token).transfer(feeRecipient, feeToken);

        IERC20(token).approve(address(uniswapRouter), netToken);

        (amountToken, amountETH, liquidity) =
            uniswapRouter.addLiquidityETH{value: netETH}(token, netToken, amountTokenMin, amountETHMin, to, deadline);

        // Refund excess ETH
        if (netETH > amountETH) {
            (bool ok,) = msg.sender.call{value: netETH - amountETH}("");
            if (!ok) revert ETHTransferFailed();
        }

        // Refund excess token
        if (netToken > amountToken) {
            IERC20(token).transfer(msg.sender, netToken - amountToken);
        }
    }

    /*//////////////////////////////////////////////////////////////
                        REMOVE LIQUIDITY (NO FEES)
                        (Slippage via amountMin parameters)
    //////////////////////////////////////////////////////////////*/

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external nonReentrant returns (uint256, uint256) {
        _validateDeadline(deadline);

        address pair = uniswapFactory.getPair(tokenA, tokenB);
        if (pair == address(0)) revert PairDoesNotExist();

        IUniswapV2Pair(pair).transferFrom(msg.sender, address(this), liquidity);
        IERC20(pair).approve(address(uniswapRouter), liquidity);

        return uniswapRouter.removeLiquidity(tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline);
    }

    function removeLiquidityETH(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external nonReentrant returns (uint256 amountToken, uint256 amountETH) {
        _validateDeadline(deadline);

        address pair = uniswapFactory.getPair(token, WETH);
        if (pair == address(0)) revert PairDoesNotExist();

        IUniswapV2Pair(pair).transferFrom(msg.sender, address(this), liquidity);
        IERC20(pair).approve(address(uniswapRouter), liquidity);

        return uniswapRouter.removeLiquidityETH(token, liquidity, amountTokenMin, amountETHMin, to, deadline);
    }

    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external nonReentrant returns (uint256 amountETH) {
        _validateDeadline(deadline);

        address pair = uniswapFactory.getPair(token, WETH);
        if (pair == address(0)) revert PairDoesNotExist();

        IUniswapV2Pair(pair).transferFrom(msg.sender, address(this), liquidity);
        IERC20(pair).approve(address(uniswapRouter), liquidity);

        return uniswapRouter.removeLiquidityETHSupportingFeeOnTransferTokens(
            token, liquidity, amountTokenMin, amountETHMin, to, deadline
        );
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function quote(uint256 amountA, uint256 reserveA, uint256 reserveB) external view returns (uint256 amountB) {
        return uniswapRouter.quote(amountA, reserveA, reserveB);
    }

    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)
        external
        view
        returns (uint256 amountOut)
    {
        return uniswapRouter.getAmountOut(amountIn, reserveIn, reserveOut);
    }

    function getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut)
        external
        view
        returns (uint256 amountIn)
    {
        return uniswapRouter.getAmountIn(amountOut, reserveIn, reserveOut);
    }

    function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts) {
        return uniswapRouter.getAmountsOut(amountIn, path);
    }

    function getAmountsIn(uint256 amountOut, address[] calldata path) external view returns (uint256[] memory amounts) {
        return uniswapRouter.getAmountsIn(amountOut, path);
    }

    /*//////////////////////////////////////////////////////////////
                        PAIR CREATION
    //////////////////////////////////////////////////////////////*/

    function createPairIfNotExists(address a, address b) external returns (address pair) {
        if (a == b) revert SameToken();
        if (a == address(0) || b == address(0)) revert ZeroAddress();

        pair = uniswapFactory.getPair(a, b);
        if (pair == address(0)) pair = uniswapFactory.createPair(a, b);
    }

    receive() external payable {}
}
