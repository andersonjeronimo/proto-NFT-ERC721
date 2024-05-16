import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ProtoNFT", function () {
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const ProtoNFT = await ethers.getContractFactory("ProtoNFT");
    const contract = await ProtoNFT.deploy();
    return { contract, owner, otherAccount };
  }

  it("Should has name", async function () {
    const { contract } = await loadFixture(deployFixture);    
    expect(await contract.name()).to.equal("ProtoNFT");
  });

  it("Should has symbol", async function () {
    const { contract } = await loadFixture(deployFixture);
    expect(await contract.symbol()).to.equal("PNFT");
  });

  it("Should mint", async function () {
    const { contract, owner } = await loadFixture(deployFixture);
    await contract.mint();
    
    const balance = await contract.balanceOf(owner.address);
    const tokenId = await contract.tokenByIndex(0);
    const ownerOf = await contract.ownerOf(tokenId);
    const ownerTokenId = await contract.tokenOfOwnerByIndex(owner.address, 0);
    const totalSupply = await contract.totalSupply();

    expect(balance).to.equal(1, "Can't mint");
    expect(tokenId).to.equal(ownerTokenId, "Can't mint");
    expect(ownerOf).to.equal(owner.address, "Can't mint");
    expect(totalSupply).to.equal(1, "Can't mint");
  });

  it("Should burn", async function () {
    const { contract, owner } = await loadFixture(deployFixture);
    await contract.mint();
    const tokenId = await contract.tokenByIndex(0);
    await contract.burn(tokenId);
    
    const balance = await contract.balanceOf(owner.address);    
    const totalSupply = await contract.totalSupply();

    expect(balance).to.equal(0, "Can't burn");        
    expect(totalSupply).to.equal(0, "Can't burn");
  });

  it("Should burn (approved)", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);
    await contract.mint();
    const tokenId = await contract.tokenByIndex(0);
    await contract.approve(otherAccount.address, tokenId);

    const instance = contract.connect(otherAccount);
    await instance.burn(tokenId);
    
    const balance = await contract.balanceOf(owner.address);    
    const totalSupply = await contract.totalSupply();

    expect(balance).to.equal(0, "Can't approve burn");        
    expect(totalSupply).to.equal(0, "Can't approve burn");
  });

  it("Should burn (approved for all)", async function () {
    const { contract, owner, otherAccount } = await loadFixture(deployFixture);
    await contract.mint();
    const tokenId = await contract.tokenByIndex(0);
    await contract.setApprovalForAll(otherAccount.address, true);

    const instance = contract.connect(otherAccount);
    await instance.burn(tokenId);
    
    const balance = await contract.balanceOf(owner.address);    
    const totalSupply = await contract.totalSupply();

    expect(balance).to.equal(0, "Can't approve burn for all");        
    expect(totalSupply).to.equal(0, "Can't approve burn for all");
  });

  it("Should NOT burn (not exists)", async function () {
    const { contract } = await loadFixture(deployFixture);
    await expect(contract.burn(1)).to.be.revertedWithCustomError(contract, "ERC721NonexistentToken");
  });

  it("Should NOT burn (permission)", async function () {
    const { contract, otherAccount } = await loadFixture(deployFixture);
    await contract.mint();
    const tokenId = await contract.tokenByIndex(0);
    //await contract.approve(otherAccount.address, tokenId);
    const instance = contract.connect(otherAccount);    
    await expect(instance.burn(tokenId)).to.be.revertedWithCustomError(contract, "ERC721InsufficientApproval");
  });

  it("Should has URI metadata", async function () {
    const { contract } = await loadFixture(deployFixture);
    await contract.mint();
    const tokenId = await contract.tokenByIndex(0);
    expect(await contract.tokenURI(tokenId)).to.equal("https://www.protonft.com/1.json", "Can't get URI metadata");
  });

  it("Should NOT has URI metadata (token not exists)", async function () {
    const { contract } = await loadFixture(deployFixture);        
    await expect(contract.tokenURI(1)).to.be.revertedWithCustomError(contract, "ERC721NonexistentToken");
  });

});
