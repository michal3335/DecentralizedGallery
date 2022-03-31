const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Gallery", function () {
  it("Should mint and trade NFTs", async function () {
    const Gallery = await ethers.getContractFactory('Gallery')
    const gallery = await Gallery.deploy()
    await gallery.deployed()
    const galleryAddress = gallery.address

    const NFT = await ethers.getContractFactory('NFT')
    const nft = await NFT.deploy(galleryAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await gallery.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits('100','ether')

    await nft.mintToken('https-t1')
    await nft.mintToken('https-t2')

    await gallery.createGalleryItem(nftContractAddress,1,auctionPrice,{value: listingPrice})
    await gallery.createGalleryItem(nftContractAddress,2,auctionPrice,{value: listingPrice})

    const [_, buyerAddress] = await ethers.getSigners()
/*
    await gallery.connect(buyerAddress).createGallerySale(nftContractAddress, 1, {
      value: auctionPrice
    })
*/
    const items = await gallery.fetchGalleryTokens();
    console.log('items', items)

  });
});
