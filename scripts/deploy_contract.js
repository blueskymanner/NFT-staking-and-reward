const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  // const deployerAddress = deployer.address;
  const deployerAddress = await deployer.getAddress();
  console.log('Deploying Gallery Contract with address:', deployerAddress);

  const JungelTycoon = await hre.ethers.getContractFactory("JungelTycoon");
  const JTT = await hre.ethers.getContractFactory("JTT");
  const Gallery = await hre.ethers.getContractFactory("Gallery");
  
  const jungelTycoon = await JungelTycoon.deploy("JungelTycoon", "JT", "AE2QU4T", "H8YOP9WCV");
  console.log('JungelTycoon contract deployed at', jungelTycoon.address);

  const jTT = await (await JTT.deploy()).deployed();
  console.log('JTT contract deployed at', jTT.address);

  const gallery = await Gallery.deploy(jungelTycoon.address, jTT.address);
  console.log('Gallery contract deployed at', gallery.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
