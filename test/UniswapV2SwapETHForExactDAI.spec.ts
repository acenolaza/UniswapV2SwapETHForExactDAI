import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {expect, util} from "chai";
import * as dotenv from "dotenv";
import {ethers} from "hardhat";

dotenv.config();

describe("UniswapV2SwapETHForExactDAI", function () {
  const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const daiAddress = "dai.tokens.ethers.eth";
  const daiAbi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",

    // Get the account balance
    "function balanceOf(address owner) external view returns (uint)",
    "function decimals() external view returns (uint8)",
  ];

  let accounts: SignerWithAddress[];

  beforeEach(async function () {
    accounts = await ethers.getSigners();
  });

  it("should swap ETH to DAI", async function () {
    const [owner] = accounts;
    console.log("Owner address: ", owner.address);

    const UniswapExampleFactory = await ethers.getContractFactory(
      "UniswapExample"
    );
    const uniswapExample = await UniswapExampleFactory.deploy();
    await uniswapExample.deployed();
    console.log("Contract address: ", uniswapExample.address);

    //@ts-ignore
    expect(uniswapExample.signer.address).to.equal(owner.address);

    const daiContract = new ethers.Contract(
      DAI_ADDRESS,
      daiAbi,
      ethers.provider
    );
    // console.log(util.inspect(daiContract));
    // daiContract.connect(owner);

    const decimals = await daiContract.decimals();
    let balance = await daiContract.balanceOf(uniswapExample.address);
    console.log(
      "Initial DAI contract BALANCE: " +
        ethers.utils.formatUnits(balance.toString(), decimals)
    );
    console.log(`DAI contract NAME: ${await daiContract.name()}`);
    console.log(`DAI contract SYMBOL: ${await daiContract.symbol()}`);
    // Unsupported by Hardhat 😞
    // expect("balanceOf").to.be.calledOnContractWith(daiContract, [
    //   uniswapExample.address,
    // ]);

    console.log(
      "ETH BALANCE BEFORE: ",
      ethers.utils.formatEther(await owner.getBalance())
    );

    const daiAmount = ethers.utils.parseEther("1500");

    const requiredEth = (
      await uniswapExample.getEstimatedETHforDAI(daiAmount)
    )[0];

    const sendEth = requiredEth * 1.1;

    // await expect(async () => {
    // const gasPrice = await provider.getGasPrice();
    const test = await uniswapExample.convertEthToExactDai(daiAmount, {
      value: sendEth.toString(),
      // gasPrice: gasPrice.toHexString(),
      // gasLimit: ethers.BigNumber.from(9500000).toHexString(),
    });
    // expect(test).not.toBeNull();
    // }).to.changeTokenBalance(daiContract, owner, 200);

    console.log(
      "ETH BALANCE AFTER: ",
      ethers.utils.formatEther(await owner.getBalance())
    );

    balance = await daiContract.balanceOf(uniswapExample.address);
    console.log(
      "Final DAI contract BALANCE: " +
        ethers.utils.formatUnits(balance.toString(), decimals)
    );
  });
});
