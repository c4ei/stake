const hre = require("hardhat");

const tokens = (n) =>{
  return hre.ethers.utils.parseUnits(n,'ether')
}

async function main() {

  const [owner, investor1,investor2] = await hre.ethers.getSigners();

  // We get the contract to deploy
  const SaWonToken = await hre.ethers.getContractFactory("SaWonToken");
  const sawonToken = await SaWonToken.deploy();
  await sawonToken.deployed();
  console.log("SaWonToken deployed to:", sawonToken.address);

  const DaeriToken = await hre.ethers.getContractFactory("DaeriToken");
  const daeriToken = await DaeriToken.deploy();
  await daeriToken.deployed();
  console.log("DaeriToken deployed to:", daeriToken.address);

  const YieldFarming = await hre.ethers.getContractFactory("YieldFarming");
  const yieldFarming = await YieldFarming.deploy(sawonToken.address,daeriToken.address);
  await yieldFarming.deployed();
  console.log("YieldFarming deployed to:", yieldFarming.address);

  await daeriToken.transfer(yieldFarming.address, tokens('1000000'), { from: owner.address })
  await sawonToken.transfer(yieldFarming.address, tokens('1000000'))

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
