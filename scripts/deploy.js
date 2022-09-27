const hre = require("hardhat");

async function main() {
    const tokenPerWei = 10;
    [owner] = await hre.ethers.getSigners();

    const GatorCoin = await hre.ethers.getContractFactory("GatorCoin", owner);
    const gatorCoin = await GatorCoin.deploy();
    await gatorCoin.deployed();

    const Presale = await hre.ethers.getContractFactory("Presale", owner);
    const presale = await Presale.deploy(tokenPerWei, owner.address, gatorCoin.address);
    await presale.deployed();

    await gatorCoin
        .connect(owner)
        .mintToken(presale.address, hre.ethers.utils.parseEther("1000000000"));

    console.log("Presale:", presale.address);
    console.log("GatorCoin:", gatorCoin.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
