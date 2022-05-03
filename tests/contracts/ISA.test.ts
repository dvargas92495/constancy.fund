import { expect, use } from "chai";
import { ethers } from "hardhat";
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
    if (!customer1 || !investor || !creator || !customer2)
      fail("At least four wallets required for test");

    const initialInvestorBalance = await investor.getBalance();
    const initialCreatorBalance = await creator.getBalance();

    const factoryContract = await ethers.getContractFactory("ISA", creator);
    const investment = utils.parseEther("20.0");
    const contract = await factoryContract.deploy(
      await investor.getAddress(),
      2000,
      30000,
      utils.parseEther("10.0"),
      "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"
    );
    await contract.deployed();
    const deployTx = await contract.deployTransaction.wait();
    const t1CreatorBalance = await creator.getBalance();
    expect(t1CreatorBalance).to.be.eq(
      initialCreatorBalance.sub(
        deployTx.effectiveGasPrice.mul(deployTx.cumulativeGasUsed)
      )
    );

    const investorView = contract.connect(investor);
    const tx = await investorView.invest({ value: investment });
    const receipt = await tx.wait();
    const t1InvestorBalance = await investor.getBalance();
    expect(t1InvestorBalance).to.be.eq(
      initialInvestorBalance
        .sub(investment)
        .sub(receipt.effectiveGasPrice.mul(receipt.cumulativeGasUsed))
    );

    // under the threshold
    const firstIncome = utils.parseEther("8.0");
    const tx2 = await customer1.sendTransaction({
      value: firstIncome,
      to: contract.address,
    });
    await tx2.wait();
    expect(await contract.balance()).to.be.eq(utils.parseEther("8.0"));
    const tx3 = await contract.creatorWithdraw();
    const receipt3 = await tx3.wait();
    const t2CreatorBalance = await creator.getBalance();
    expect(await contract.returnAllocated()).to.be.eq(utils.parseEther("0.0"));
    expect(t2CreatorBalance).to.be.eq(
      t1CreatorBalance
        .add(firstIncome)
        .add(investment)
        .sub(receipt3.effectiveGasPrice.mul(receipt3.cumulativeGasUsed))
    );

    // past the threshold into rev share
    const secondIncome = utils.parseEther("12.0");
    const tx4 = await customer2.sendTransaction({
      value: secondIncome,
      to: contract.address,
    });
    await tx4.wait();
    const tx5 = await investorView.investorWithdraw();
    const receipt5 = await tx5.wait();
    const t2InvestorBalance = await investor.getBalance();
    expect(t2InvestorBalance).to.be.eq(
      t1InvestorBalance
        .add(utils.parseEther("2.0"))
        .sub(receipt5.effectiveGasPrice.mul(receipt5.cumulativeGasUsed))
    );

    // in the middle of the rev share
    const thirdIncome = utils.parseEther("90.0");
    const tx6 = await customer1.sendTransaction({
      value: thirdIncome,
      to: contract.address,
    });
    await tx6.wait();
    const tx7 = await contract.creatorWithdraw();
    const receipt7 = await tx7.wait();
    const tx8 = await investorView.investorWithdraw();
    const receipt8 = await tx8.wait();
    const t3InvestorBalance = await investor.getBalance();
    const t3CreatorBalance = await creator.getBalance();
    expect(t3CreatorBalance).to.be.eq(
      t2CreatorBalance
        .add(utils.parseEther("82.0"))
        .sub(receipt7.effectiveGasPrice.mul(receipt7.cumulativeGasUsed))
    );
    expect(t3InvestorBalance).to.be.eq(
      t2InvestorBalance
        .add(utils.parseEther("18.0"))
        .sub(receipt8.effectiveGasPrice.mul(receipt8.cumulativeGasUsed))
    );

    // past the rev share cap
    const fourthIncome = utils.parseEther("400.0");
    const tx11 = await customer2.sendTransaction({
      value: fourthIncome,
      to: contract.address,
    });
    await tx11.wait();
    const tx10 = await investorView.investorWithdraw();
    const receipt10 = await tx10.wait();
    const tx9 = await contract.creatorWithdraw();
    const receipt9 = await tx9.wait();
    const t4InvestorBalance = await investor.getBalance();
    const t4CreatorBalance = await creator.getBalance();
    expect(t4CreatorBalance).to.be.eq(
      t3CreatorBalance
        .add(utils.parseEther("360.0"))
        .sub(receipt9.effectiveGasPrice.mul(receipt9.cumulativeGasUsed))
    );
    expect(t4InvestorBalance).to.be.eq(
      t3InvestorBalance
        .add(utils.parseEther("40.0"))
        .sub(receipt10.effectiveGasPrice.mul(receipt10.cumulativeGasUsed))
    );
  });
});
