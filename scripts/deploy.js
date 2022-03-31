// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
 
  const NFTGallery = await hre.ethers.getContractFactory("Gallery");
  const nftGallery = await NFTGallery.deploy();
  await nftGallery.deployed();
  console.log("NFTGallery deployed to:", nftGallery.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftGallery.address);
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);

  let addresses = `
  export const nftgalleryaddress = ${nftGallery.address}
  export const nftaddress = ${nft.address}`

  let data = JSON.stringify(addresses)
  fs.writeFileSync('config.js', JSON.parse(data))
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
