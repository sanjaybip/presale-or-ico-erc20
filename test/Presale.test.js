const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Presale", function () {
    async function deployPresaleFixture() {
        const tokenPerWei = 10;
        const [owner, signer2] = await ethers.getSigners();
        const GatorCoin = await ethers.getContractFactory("GatorCoin", owner);
        const gatorCoin = await GatorCoin.deploy();
        await gatorCoin.deployed();

        const Presale = await ethers.getContractFactory("Presale", owner);
        const presale = await Presale.deploy(tokenPerWei, owner.address, gatorCoin.address);
        await presale.deployed();

        return { presale, gatorCoin, owner, signer2 };
    }
    describe("buyTokens", function () {
        it("should buy token", async () => {
            const { presale, gatorCoin, owner, signer2 } = await loadFixture(
                deployPresaleFixture
            );
            let totalSupply;
            let signer2Balance;

            totalSupply = await gatorCoin.totalSupply();
            signer2Balance = await gatorCoin.balanceOf(signer2.address);
            expect(totalSupply).to.be.equal(0);
            expect(signer2Balance).to.be.equal(0);

            await gatorCoin
                .connect(owner)
                .mintToken(presale.address, ethers.utils.parseEther("1000000000"));

            const ownerEtherBalanceOld = await owner.getBalance();

            await presale
                .connect(signer2)
                .buyTokens(signer2.address, { value: ethers.utils.parseEther("5") });

            totalSupply = await gatorCoin.totalSupply();
            signer2Balance = await gatorCoin.connect(owner).balanceOf(signer2.address);
            const ownerEtherBalanceNew = await owner.getBalance();

            expect(totalSupply).to.be.equal(ethers.utils.parseEther("1000000000"));
            expect(signer2Balance).to.be.equal(ethers.utils.parseEther("50"));
            expect(ownerEtherBalanceNew).to.be.above(ownerEtherBalanceOld);
        });
    });
});
