import { expect, use } from "chai";
import { ethers, waffle } from "hardhat";
import { solidity } from "ethereum-waffle";
import { utils } from "ethers";
import { fail } from "assert";

use(solidity);

describe("ISA", function () {
  it("Should payout to creator and investor correctly", async function () {
    const wallets = await ethers.getSigners();
    
    const investor = wallets.pop();
    const creator = wallets.pop();
    const customer1 = wallets.pop();
    const customer2 = wallets.pop();

    const factoryContract = await ethers.getContractFactory("ISA", creator);
    const investment = utils.parseEther("20.0");
    const contract = await factoryContract.deploy(
      await investor.getAddress(),
      20,
      utils.parseEther("60.0"),
      utils.parseEther("10.0"),
      "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
    );
    await contract.deployed();
  });
});
