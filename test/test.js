const {expect} = require("chai");
const {ethers} = require("hardhat");
require("dotenv").config();

describe("UniswapV2SwapETHForExactDAI", function () {
  const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const daiAddress = "dai.tokens.ethers.eth";
  const daiAbi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",

    // Get the account balance
    "function balanceOf(address) view returns (uint)",
  ];

  it("should swap ETH to DAI", async function () {
    const [owner, addr1] = await ethers.getSigners();
    console.log("Owner address: ", owner.address);

    const UniswapExampleFactory = await ethers.getContractFactory(
      "UniswapExample"
    );
    const uniswapExample = await UniswapExampleFactory.deploy();
    expect(uniswapExample.signer.address).to.equal(owner.address);

    await uniswapExample.deployed();

    const provider = new ethers.getDefaultProvider("homestead", {
      alchemy: process.env.ALCHEMY_API_KEY,
    });
    const daiContract = new ethers.Contract(DAI_ADDRESS, daiAbi, provider);

    let balance = await daiContract.balanceOf(owner.address);
    console.log(`Owner DAI balance is: ${ethers.utils.formatEther(balance)}`);

    console.log(`DAI contract NAME: ${await daiContract.name()}`);
    console.log(`DAI contract SYMBOL: ${await daiContract.symbol()}`);

    console.log(
      "ETH BALANCE BEFORE: ",
      ethers.utils.formatEther(await owner.getBalance())
    );

    const daiAmount = ethers.utils.parseEther("1500");

    const requiredEth = (
      await uniswapExample.getEstimatedETHforDAI(daiAmount)
    )[0];

    const sendEth = requiredEth * 1.1;

    const test = await uniswapExample.convertEthToDai(daiAmount, {
      value: sendEth.toString(),
    });

    // expect(test).not.toBeNull();

    console.log(
      "ETH BALANCE AFTER: ",
      ethers.utils.formatEther(await owner.getBalance())
    );

    let newBalance = await daiContract.balanceOf(owner.address);
    console.log(
      `Owner DAI balance is: ${ethers.utils.formatEther(newBalance)}`
    );
  });
});
