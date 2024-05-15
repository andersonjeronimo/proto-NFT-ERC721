import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("ProtoNFT", function () {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const ProtoNFT = await hre.ethers.getContractFactory("ProtoNFT");
    const contract = ProtoNFT.deploy();
    return { contract, owner, otherAccount };
  }

  it("Should ...", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);
    expect(true).to.equal(true);
  });

});
