//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Gallery is ReentrancyGuard {
    using Counters for Counters.Counter;

    address payable owner;
    uint256 listingPrice = 0.025 ether;

    Counters.Counter private IdToken;
    Counters.Counter private SoldTokens;

    constructor() {
        owner = payable(msg.sender);
    }

    struct GalleryToken {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }
    mapping(uint256 => GalleryToken) private idToGalleryToken;

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function newGalleryItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(
            msg.value == listingPrice,
            "Insufficient funds provided for listing price. "
        );

        IdToken.increment();
        uint256 itemId = IdToken.current();

        idToGalleryToken[itemId] = GalleryToken(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
    }

    function makeSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToGalleryToken[itemId].price;
        uint256 tokenId = idToGalleryToken[itemId].tokenId;
        require(msg.value == price, "Submit the price!");

        idToGalleryToken[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        idToGalleryToken[itemId].owner = payable(msg.sender);
        idToGalleryToken[itemId].sold = true;
        SoldTokens.increment();

        payable(owner).transfer(listingPrice);
    }

    function fetchTokensForSale() public view returns (GalleryToken[] memory) {
        uint256 count = IdToken.current();
        uint256 unsoldcount = IdToken.current() - SoldTokens.current();
        uint256 Index = 0;

        GalleryToken[] memory items = new GalleryToken[](unsoldcount);
        for (uint256 i = 0; i < count; i++) {
            if (idToGalleryToken[i + 1].owner == address(0)) {
                uint256 currentId = i + 1;
                GalleryToken storage currentItem = idToGalleryToken[currentId];
                items[Index] = currentItem;
                Index += 1;
            }
        }
        return items;
    }

    function fetchAllTokens() public view returns (GalleryToken[] memory) {
        uint256 Index = 0;
        uint256 count = IdToken.current();

        GalleryToken[] memory items = new GalleryToken[](count);
        for (uint256 i = 0; i < count; i++) {
            uint256 currentId = i + 1;
            GalleryToken storage currentItem = idToGalleryToken[currentId];
            items[Index] = currentItem;
            Index += 1;
        }
        return items;
    }

    function fetchMyTokens() public view returns (GalleryToken[] memory) {
        uint256 allcount = IdToken.current();
        uint256 count = 0;
        uint256 Index = 0;

        for (uint256 i = 0; i < allcount; i++) {
            if (idToGalleryToken[i + 1].owner == msg.sender) {
                count += 1;
            }
        }

        GalleryToken[] memory items = new GalleryToken[](count);
        for (uint256 i = 0; i < allcount; i++) {
            if (idToGalleryToken[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                GalleryToken storage currentItem = idToGalleryToken[currentId];
                items[Index] = currentItem;
                Index += 1;
            }
        }
        return items;
    }
}
