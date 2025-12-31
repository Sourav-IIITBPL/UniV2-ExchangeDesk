// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/*//////////////////////////////////////////////////////////////
                            INTERFACES
//////////////////////////////////////////////////////////////*/

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);

    function swapTokensForExactETH(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapETHForExactTokens(
        uint amountOut,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);

    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);

    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint amountA, uint amountB);

    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint amountToken, uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);

    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint amountETH);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

interface IUniswapV2Pair {
    function balanceOf(address user) external view returns (uint);
    function transferFrom(address from, address to, uint value) external returns (bool);
    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function token0() external view returns (address);
    function token1() external view returns (address);
}

interface IERC20 {
    function transferFrom(address from, address to, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function approve(address spender, uint value) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

interface IWETH {
    function deposit() external payable;
    function withdraw(uint) external;
    function transfer(address to, uint value) external returns (bool);
    function approve(address spender, uint value) external returns (bool);
}

/*//////////////////////////////////////////////////////////////
                        EXCHANGE DESK ROUTER
//////////////////////////////////////////////////////////////*/

/// @title ExchangeDeskRouter
/// @notice Audit-grade router implementing full IUniswapV2Router02 functionality with fee-on-transfer support
/// @dev Enforces strict invariants: no same-token, no zero-address, pair existence, deadline bounds, CEI pattern
contract ExchangeDeskRouter is Ownable, ReentrancyGuard {
    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/

    uint256 public constant MAX_FEE_BPS = 50; // 0.5%
    uint256 public constant BPS_DENOMINATOR = 10_000;
    uint256 public constant MAX_DEADLINE_WINDOW = 10 minutes;

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/

    IUniswapV2Router02 public immutable uniswapRouter;
    IUniswapV2Factory public immutable uniswapFactory;
    address public immutable WETH;

    address public feeRecipient;
    uint256 public feeBps = 5; // 0.05%

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error ZeroAddress();
    error SameToken();
    error PairDoesNotExist();
    error InvalidDeadline();
    error InsufficientLiquidityBalance();
    error FeeTooHigh();
    error InvalidPath();
    error InsufficientOutputAmount();
    error ExcessiveInputAmount();
    error ETHTransferFailed();
    error InvalidMsgValue();

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event FeeRecipientUpdated(address indexed oldRecipient, address indexed newRecipient);
    event FeeBpsUpdated(uint256 oldFeeBps, uint256 newFeeBps);

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        address _router,
        address _factory,
        address _weth,
        address _feeRecipient
    ) Ownable(msg.sender) {
        if (_router == address(0) || _factory == address(0) || _weth == address(0) || _feeRecipient == address(0)) {
            revert ZeroAddress();
        }

        uniswapRouter = IUniswapV2Router02(_router);
        uniswapFactory = IUniswapV2Factory(_factory);
        WETH = _weth;
        feeRecipient = _feeRecipient;
    }

    /*//////////////////////////////////////////////////////////////
                        ADMIN CONTROLS
    //////////////////////////////////////////////////////////////*/

    /// @notice Update fee recipient address
    /// @param newRecipient New fee recipient address
    function setFeeRecipient(address newRecipient) external onlyOwner {
        if (newRecipient == address(0)) revert ZeroAddress();
        emit FeeRecipientUpdated(feeRecipient, newRecipient);
        feeRecipient = newRecipient;
    }

    /// @notice Update fee basis points
    /// @param newFeeBps New fee in basis points (max 0.5%)
    function setFeeBps(uint256 newFeeBps) external onlyOwner {
        if (newFeeBps > MAX_FEE_BPS) revert FeeTooHigh();
        emit FeeBpsUpdated(feeBps, newFeeBps);
        feeBps = newFeeBps;
    }

    /*//////////////////////////////////////////////////////////////
                        INTERNAL HELPERS
    //////////////////////////////////////////////////////////////*/

    /// @dev Validates deadline is within acceptable window
    function _validateDeadline(uint256 deadline) internal view {
        if (deadline < block.timestamp || deadline > block.timestamp + MAX_DEADLINE_WINDOW) {
            revert InvalidDeadline();
        }
    }

    /// @dev Validates tokens are different and non-zero
    function _validateTokens(address tokenA, address tokenB) internal pure {
        if (tokenA == address(0) || tokenB == address(0)) revert ZeroAddress();
        if (tokenA == tokenB) revert SameToken();
    }

    /// @dev Validates single token is non-zero
    function _validateToken(address token) internal pure {
        if (token == address(0)) revert ZeroAddress();
    }

    /// @dev Validates path has at least 2 tokens
    function _validatePath(address[] calldata path) internal pure {
        if (path.length < 2) revert InvalidPath();
    }

    /// @dev Takes fee from amount and returns net amount
    function _takeFee(address token, uint256 amount) internal returns (uint256 net) {
        uint256 fee = (amount * feeBps) / BPS_DENOMINATOR;
        if (fee > 0) {
            IERC20(token).transfer(feeRecipient, fee);
        }
        net = amount - fee;
    }

    /// @dev Wraps ETH to WETH
    function _wrapETH(uint256 amount) internal {
        IWETH(WETH).deposit{value: amount}();
    }

    /// @dev Unwraps WETH to ETH and sends to recipient
    function _unwrapAndSendETH(address to, uint256 amount) internal {
        IWETH(WETH).withdraw(amount);
        (bool success, ) = to.call{value: amount}("");
        if (!success) revert ETHTransferFailed();
    }

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Returns factory address
    function factory() external view returns (address) {
        return address(uniswapFactory);
    }

    /// @notice Quote for given amounts and reserves
    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB) {
        return uniswapRouter.quote(amountA, reserveA, reserveB);
    }

    /// @notice Calculate output amount for given input
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut) {
        return uniswapRouter.getAmountOut(amountIn, reserveIn, reserveOut);
    }

    /// @notice Calculate input amount for given output
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn) {
        return uniswapRouter.getAmountIn(amountOut, reserveIn, reserveOut);
    }

    /// @notice Get output amounts for path
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts) {
        return uniswapRouter.getAmountsOut(amountIn, path);
    }

    /// @notice Get input amounts for path
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts) {
        return uniswapRouter.getAmountsIn(amountOut, path);
    }

    /*//////////////////////////////////////////////////////////////
                        SWAP FUNCTIONS - EXACT INPUT
    //////////////////////////////////////////////////////////////*/

    /// @notice Swap exact tokens for tokens
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external nonReentrant returns (uint[] memory amounts) {
        _validateDeadline(deadline);
        _validatePath(path);
        _validateTokens(path[0], path[path.length - 1]);

        address tokenIn = path[0];
        
        // Transfer tokens from user
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        
        // Take fee
        uint netAmount = _takeFee(tokenIn, amountIn);
        
        // Approve and swap
        IERC20(tokenIn).approve(address(uniswapRouter), netAmount);
        amounts = uniswapRouter.swapExactTokensForTokens(
            netAmount,
            amountOutMin,
            path,
            to,
            deadline
        );
    }

    /// @notice Swap exact ETH for tokens
    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable nonReentrant returns (uint[] memory amounts) {
        _validateDeadline(deadline);
        _validatePath(path);
        if (path[0] != WETH) revert InvalidPath();
        
        uint netAmount = msg.value;
        
        // Take fee in ETH
        uint fee = (msg.value * feeBps) / BPS_DENOMINATOR;
        if (fee > 0) {
            netAmount = msg.value - fee;
            (bool success, ) = feeRecipient.call{value: fee}("");
            if (!success) revert ETHTransferFailed();
        }
        
        // Wrap ETH and swap
        _wrapETH(netAmount);
        IERC20(WETH).approve(address(uniswapRouter), netAmount);
        amounts = uniswapRouter.swapExactETHForTokens{value: 0}(
            amountOutMin,
            path,
            to,
            deadline
        );
    }

    /// @notice Swap exact tokens for ETH
    function swapExactTokensForETH(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external nonReentrant returns (uint[] memory amounts) {
        _validateDeadline(deadline);
        _validatePath(path);
        if (path[path.length - 1] != WETH) revert InvalidPath();

        address tokenIn = path[0];
        
        // Transfer and take fee
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        uint netAmount = _takeFee(tokenIn, amountIn);
        
        // Swap to WETH
        IERC20(tokenIn).approve(address(uniswapRouter), netAmount);
        amounts = uniswapRouter.swapExactTokensForETH(
            netAmount,
            amountOutMin,
            path,
            address(this),
            deadline
        );
        
        // Unwrap and send ETH
        _unwrapAndSendETH(to, amounts[amounts.length - 1]);
    }

    /*//////////////////////////////////////////////////////////////
                        SWAP FUNCTIONS - EXACT OUTPUT
    //////////////////////////////////////////////////////////////*/

    /// @notice Swap tokens for exact tokens
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external nonReentrant returns (uint[] memory amounts) {
        _validateDeadline(deadline);
        _validatePath(path);
        _validateTokens(path[0], path[path.length - 1]);

        address tokenIn = path[0];
        
        // Transfer max amount from user
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInMax);
        
        // Take fee
        uint netMax = _takeFee(tokenIn, amountInMax);
        
        // Swap
        IERC20(tokenIn).approve(address(uniswapRouter), netMax);
        amounts = uniswapRouter.swapTokensForExactTokens(
            amountOut,
            netMax,
            path,
            to,
            deadline
        );
        
        // Refund unused tokens (CEI: refund after swap)
        uint actualUsed = amounts[0];
        if (netMax > actualUsed) {
            IERC20(tokenIn).transfer(msg.sender, netMax - actualUsed);
        }
    }

    /// @notice Swap ETH for exact tokens
    function swapETHForExactTokens(
        uint amountOut,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable nonReentrant returns (uint[] memory amounts) {
        _validateDeadline(deadline);
        _validatePath(path);
        if (path[0] != WETH) revert InvalidPath();
        
        // Take fee from ETH
        uint fee = (msg.value * feeBps) / BPS_DENOMINATOR;
        uint netMax = msg.value - fee;
        
        if (fee > 0) {
            (bool success, ) = feeRecipient.call{value: fee}("");
            if (!success) revert ETHTransferFailed();
        }
        
        // Wrap and swap
        _wrapETH(netMax);
        IERC20(WETH).approve(address(uniswapRouter), netMax);
        amounts = uniswapRouter.swapETHForExactTokens{value: 0}(
            amountOut,
            path,
            to,
            deadline
        );
        
        // Refund unused WETH as ETH
        uint actualUsed = amounts[0];
        if (netMax > actualUsed) {
            _unwrapAndSendETH(msg.sender, netMax - actualUsed);
        }
    }

    /// @notice Swap tokens for exact ETH
    function swapTokensForExactETH(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external nonReentrant returns (uint[] memory amounts) {
        _validateDeadline(deadline);
        _validatePath(path);
        if (path[path.length - 1] != WETH) revert InvalidPath();

        address tokenIn = path[0];
        
        // Transfer and take fee
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInMax);
        uint netMax = _takeFee(tokenIn, amountInMax);
        
        // Swap to WETH
        IERC20(tokenIn).approve(address(uniswapRouter), netMax);
        amounts = uniswapRouter.swapTokensForExactETH(
            amountOut,
            netMax,
            path,
            address(this),
            deadline
        );
        
        // Unwrap and send ETH
        _unwrapAndSendETH(to, amounts[amounts.length - 1]);
        
        // Refund unused tokens
        uint actualUsed = amounts[0];
        if (netMax > actualUsed) {
            IERC20(tokenIn).transfer(msg.sender, netMax - actualUsed);
        }
    }

    /*//////////////////////////////////////////////////////////////
                    SWAP FUNCTIONS - FEE ON TRANSFER
    //////////////////////////////////////////////////////////////*/

    /// @notice Swap exact tokens for tokens (supports fee-on-transfer tokens)
    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external nonReentrant {
        _validateDeadline(deadline);
        _validatePath(path);
        _validateTokens(path[0], path[path.length - 1]);

        address tokenIn = path[0];
        
        // Transfer and take fee
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        uint netAmount = _takeFee(tokenIn, amountIn);
        
        // Swap
        IERC20(tokenIn).approve(address(uniswapRouter), netAmount);
        uniswapRouter.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            netAmount,
            amountOutMin,
            path,
            to,
            deadline
        );
    }

    /// @notice Swap exact ETH for tokens (supports fee-on-transfer tokens)
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable nonReentrant {
        _validateDeadline(deadline);
        _validatePath(path);
        if (path[0] != WETH) revert InvalidPath();
        
        // Take fee
        uint fee = (msg.value * feeBps) / BPS_DENOMINATOR;
        uint netAmount = msg.value - fee;
        
        if (fee > 0) {
            (bool success, ) = feeRecipient.call{value: fee}("");
            if (!success) revert ETHTransferFailed();
        }
        
        // Wrap and swap
        _wrapETH(netAmount);
        IERC20(WETH).approve(address(uniswapRouter), netAmount);
        uniswapRouter.swapExactETHForTokensSupportingFeeOnTransferTokens{value: 0}(
            amountOutMin,
            path,
            to,
            deadline
        );
    }

    /// @notice Swap exact tokens for ETH (supports fee-on-transfer tokens)
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external nonReentrant {
        _validateDeadline(deadline);
        _validatePath(path);
        if (path[path.length - 1] != WETH) revert InvalidPath();

        address tokenIn = path[0];
        
        // Transfer and take fee
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        uint netAmount = _takeFee(tokenIn, amountIn);
        
        // Swap to WETH
        IERC20(tokenIn).approve(address(uniswapRouter), netAmount);
        
        uint balanceBefore = IERC20(WETH).balanceOf(address(this));
        uniswapRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
            netAmount,
            amountOutMin,
            path,
            address(this),
            deadline
        );
        uint balanceAfter = IERC20(WETH).balanceOf(address(this));
        
        // Unwrap and send actual received amount
        _unwrapAndSendETH(to, balanceAfter - balanceBefore);
    }

    /*//////////////////////////////////////////////////////////////
                            ADD LIQUIDITY
    //////////////////////////////////////////////////////////////*/

    /// @notice Add liquidity to token pair
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external nonReentrant returns (uint amountA, uint amountB, uint liquidity) {
        _validateDeadline(deadline);
        _validateTokens(tokenA, tokenB);

        // Transfer tokens
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountADesired);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountBDesired);

        // Take fees
        uint netA = _takeFee(tokenA, amountADesired);
        uint netB = _takeFee(tokenB, amountBDesired);

        // Add liquidity
        IERC20(tokenA).approve(address(uniswapRouter), netA);
        IERC20(tokenB).approve(address(uniswapRouter), netB);

        (amountA, amountB, liquidity) = uniswapRouter.addLiquidity(
            tokenA,
            tokenB,
            netA,
            netB,
            amountAMin,
            amountBMin,
            to,
            deadline
        );

        // Refund unused tokens (CEI)
        if (netA > amountA) IERC20(tokenA).transfer(msg.sender, netA - amountA);
        if (netB > amountB) IERC20(tokenB).transfer(msg.sender, netB - amountB);
    }

    /// @notice Add liquidity with ETH
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable nonReentrant returns (uint amountToken, uint amountETH, uint liquidity) {
        _validateDeadline(deadline);
        _validateToken(token);
        if (token == WETH) revert SameToken();

        // Transfer token and take fee
        IERC20(token).transferFrom(msg.sender, address(this), amountTokenDesired);
        uint netToken = _takeFee(token, amountTokenDesired);

        // Take fee from ETH
        uint feeETH = (msg.value * feeBps) / BPS_DENOMINATOR;
        uint netETH = msg.value - feeETH;
        
        if (feeETH > 0) {
            (bool success, ) = feeRecipient.call{value: feeETH}("");
            if (!success) revert ETHTransferFailed();
        }

        // Wrap ETH
        _wrapETH(netETH);

        // Add liquidity
        IERC20(token).approve(address(uniswapRouter), netToken);
        IERC20(WETH).approve(address(uniswapRouter), netETH);

        (amountToken, amountETH, liquidity) = uniswapRouter.addLiquidity(
            token,
            WETH,
            netToken,
            netETH,
            amountTokenMin,
            amountETHMin,
            to,
            deadline
        );

        // Refund unused
        if (netToken > amountToken) IERC20(token).transfer(msg.sender, netToken - amountToken);
        if (netETH > amountETH) _unwrapAndSendETH(msg.sender, netETH - amountETH);
    }

    /*//////////////////////////////////////////////////////////////
                          REMOVE LIQUIDITY
    //////////////////////////////////////////////////////////////*/

    /// @notice Remove liquidity from token pair
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external nonReentrant returns (uint amountA, uint amountB) {
        _validateDeadline(deadline);
        _validateTokens(tokenA, tokenB);

        address pair = uniswapFactory.getPair(tokenA, tokenB);
        if (pair == address(0)) revert PairDoesNotExist();

        // Transfer LP tokens
        IUniswapV2Pair(pair).transferFrom(msg.sender, address(this), liquidity);
        IUniswapV2Pair(pair).approve(address(uniswapRouter), liquidity);

        // Remove liquidity
        (amountA, amountB) = uniswapRouter.removeLiquidity(
            tokenA,
            tokenB,
            liquidity,
            amountAMin,
            amountBMin,
            to,
            deadline
        );
    }

    /// @notice Remove liquidity and receive ETH
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external nonReentrant returns (uint amountToken, uint amountETH) {
        _validateDeadline(deadline);
        _validateToken(token);
        if (token == WETH) revert SameToken();

        address pair = uniswapFactory.getPair(token, WETH);
        if (pair == address(0)) revert PairDoesNotExist();

        // Transfer and approve LP tokens
        IUniswapV2Pair(pair).transferFrom(msg.sender, address(this), liquidity);
        IUniswapV2Pair(pair).approve(address(uniswapRouter), liquidity);

        // Remove liquidity to this contract
        (amountToken, amountETH) = uniswapRouter.removeLiquidity(
            token,
            WETH,
            liquidity,
            amountTokenMin,
            amountETHMin,
            address(this),
            deadline
        );

        // Transfer token to user
        IERC20(token).transfer(to, amountToken);
        
        // Unwrap and send ETH
        _unwrapAndSendETH(to, amountETH);
    }

    /*//////////////////////////////////////////////////////////////
                    REMOVE LIQUIDITY WITH PERMIT
    //////////////////////////////////////////////////////////////*/

    /// @notice Remove liquidity using permit
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant returns (uint amountA, uint amountB) {
        _validateDeadline(deadline);
        _validateTokens(tokenA, tokenB);

        address pair = uniswapFactory.getPair(tokenA, tokenB);
        if (pair == address(0)) revert PairDoesNotExist();

        // Use permit
        uint value = approveMax ? type(uint).max : liquidity;
        IUniswapV2Pair(pair).permit(msg.sender, address(this), value, deadline, v, r, s);

        // Transfer and remove
        IUniswapV2Pair(pair).transferFrom(msg.sender, address(this), liquidity);
        IUniswapV2Pair(pair).approve(address(uniswapRouter), liquidity);

        (amountA, amountB) = uniswapRouter.removeLiquidity(
            tokenA,
            tokenB,
            liquidity,
            amountAMin,
            amountBMin,
            to,
            deadline
        );
    }

    /// @notice Remove liquidity ETH using permit
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant returns (uint amountToken, uint amountETH) {
        _validateDeadline(deadline);
        _validateToken(token);
        if (token == WETH) revert SameToken();

        address pair = uniswapFactory.getPair(token, WETH);
        if (pair == address(0)) revert PairDoesNotExist();

        // Use permit
        uint value = approveMax ? type(uint).max : liquidity;
        IUniswapV2Pair(pair).permit(msg.sender, address(this), value, deadline, v, r, s);

        // Transfer and remove
        IUniswapV2Pair(pair).transferFrom(msg.sender, address(this), liquidity);
        IUniswapV2Pair(pair).approve(address(uniswapRouter), liquidity);

        (amountToken, amountETH) = uniswapRouter.removeLiquidity(
            token,
            WETH,
            liquidity,
            amountTokenMin,
            amountETHMin,
            address(this),
            deadline
        );

        // Transfer token and unwrap ETH
        IERC20(token).transfer(to, amountToken);
        _unwrapAndSendETH(to, amountETH);
    }

    /*//////////////////////////////////////////////////////////////
            REMOVE LIQUIDITY - FEE ON TRANSFER SUPPORT
    //////////////////////////////////////////////////////////////*/

    /// @notice Remove liquidity ETH (supports fee-on-transfer tokens)
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external nonReentrant returns (uint amountETH) {
        _validateDeadline(deadline);
        _validateToken(token);
        if (token == WETH) revert SameToken();

        address pair = uniswapFactory.getPair(token, WETH);
        if (pair == address(0)) revert PairDoesNotExist();

        // Transfer and approve LP tokens
        IUniswapV2Pair(pair).transferFrom(msg.sender, address(this), liquidity);
        IUniswapV2Pair(pair).approve(address(uniswapRouter), liquidity);

        // Check balances before
        uint tokenBalBefore = IERC20(token).balanceOf(address(this));
        uint wethBalBefore = IERC20(WETH).balanceOf(address(this));

        // Remove liquidity
        uniswapRouter.removeLiquidity(
            token,
            WETH,
            liquidity,
            amountTokenMin,
            amountETHMin,
            address(this),
            deadline
        );

        // Calculate actual received amounts
        uint tokenReceived = IERC20(token).balanceOf(address(this)) - tokenBalBefore;
        amountETH = IERC20(WETH).balanceOf(address(this)) - wethBalBefore;

        // Transfer actual received token amount
        IERC20(token).transfer(to, tokenReceived);
        
        // Unwrap and send ETH
        _unwrapAndSendETH(to, amountETH);
    }

    /// @notice Remove liquidity ETH with permit (supports fee-on-transfer tokens)
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external nonReentrant returns (uint amountETH) {
        _validateDeadline(deadline);
        _validateToken(token);
        if (token == WETH) revert SameToken();

        address pair = uniswapFactory.getPair(token, WETH);
        if (pair == address(0)) revert PairDoesNotExist();

        // Use permit
        uint value = approveMax ? type(uint).max : liquidity;
        IUniswapV2Pair(pair).permit(msg.sender, address(this), value, deadline, v, r, s);

        // Transfer and approve LP tokens
        IUniswapV2Pair(pair).transferFrom(msg.sender, address(this), liquidity);
        IUniswapV2Pair(pair).approve(address(uniswapRouter), liquidity);

        // Check balances before
        uint tokenBalBefore = IERC20(token).balanceOf(address(this));
        uint wethBalBefore = IERC20(WETH).balanceOf(address(this));

        // Remove liquidity
        uniswapRouter.removeLiquidity(
            token,
            WETH,
            liquidity,
            amountTokenMin,
            amountETHMin,
            address(this),
            deadline
        );

        // Calculate actual received amounts
        uint tokenReceived = IERC20(token).balanceOf(address(this)) - tokenBalBefore;
        amountETH = IERC20(WETH).balanceOf(address(this)) - wethBalBefore;

        // Transfer actual received token amount
        IERC20(token).transfer(to, tokenReceived);
        
        // Unwrap and send ETH
        _unwrapAndSendETH(to, amountETH);
    }

    /*//////////////////////////////////////////////////////////////
                            CREATE PAIR
    //////////////////////////////////////////////////////////////*/

    /// @notice Create a new pair if it doesn't exist
    function createPairIfNotExists(address tokenA, address tokenB) external returns (address pair) {
        _validateTokens(tokenA, tokenB);

        pair = uniswapFactory.getPair(tokenA, tokenB);
        if (pair == address(0)) {
            pair = uniswapFactory.createPair(tokenA, tokenB);
        }
    }

    /*//////////////////////////////////////////////////////////////
                        RECEIVE ETH
    //////////////////////////////////////////////////////////////*/

    /// @notice Receive ETH (for WETH unwrapping)
    receive() external payable {
        // Only accept ETH from WETH contract
        if (msg.sender != WETH) revert ETHTransferFailed();
    }
}