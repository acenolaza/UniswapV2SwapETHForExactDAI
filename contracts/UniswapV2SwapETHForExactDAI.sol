pragma solidity 0.7.3;

// import "https://github.com/Uniswap/uniswap-v2-periphery/blob/master/contracts/interfaces/IUniswapV2Router02.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

interface IUniswapV2Router01 {
    function WETH() external pure returns (address);

    function swapETHForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function getAmountsIn(uint256 amountOut, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);
}

contract UniswapExample {
    address internal constant UNISWAP_ROUTER_ADDRESS =
        address(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
    address internal constant DAI_TOKEN_ADDRESS =
        address(0x6B175474E89094C44Da98b954EedeAC495271d0F);

    IUniswapV2Router01 public uniswapRouter;
    IERC20 private daiToken;

    constructor() {
        uniswapRouter = IUniswapV2Router01(UNISWAP_ROUTER_ADDRESS);
        daiToken = IERC20(DAI_TOKEN_ADDRESS);
    }

    function convertEthToExactDai(uint256 daiAmount) public payable {
        console.log("Value: %s", msg.value);
        console.log("Trying to send %s tokens to %s", daiAmount, address(this));

        console.log(
            "token balance before swap:",
            daiToken.balanceOf(address(this))
        );

        uint256 deadline = block.timestamp + 15; // using 'now' for convenience, for mainnet pass deadline from frontend!
        uint256[] memory amounts =
            uniswapRouter.swapETHForExactTokens{value: msg.value}(
                daiAmount,
                getPathForETHtoDAI(),
                address(this),
                deadline
            );

        console.log("Amount [0]:%s - [1]:%s", amounts[0], amounts[1]);

        console.log("Leftover: %s", address(this).balance);

        // refund leftover ETH to user
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "refund failed");

        console.log(
            "token balance after swap:",
            daiToken.balanceOf(address(this))
        );
    }

    function getEstimatedETHforDAI(uint256 daiAmount)
        public
        view
        returns (uint256[] memory)
    {
        return uniswapRouter.getAmountsIn(daiAmount, getPathForETHtoDAI());
    }

    function getPathForETHtoDAI() private view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = DAI_TOKEN_ADDRESS;

        return path;
    }

    // important to receive ETH
    receive() external payable {}
}
