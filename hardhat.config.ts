import "@nomiclabs/hardhat-waffle";
import * as dotenv from "dotenv";
import {HardhatUserConfig, task} from "hardhat/config";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (_args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: "0.7.3",
  networks: {
    hardhat: {
      forking: {
        url: `${process.env.ALCHEMY_MAINNET_RPC_URL}${process.env.ALCHEMY_API_KEY}`,
      },
      // loggingEnabled: true,
    },
  },
  mocha: {
    timeout: 50000,
  },
};

export default config;
