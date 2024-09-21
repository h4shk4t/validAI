// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Marketplace is Ownable {
    struct Item {
        uint256 id;
        address seller;
        uint256 price;
        bool isListed;
    }

    IERC20 public validCoin; // ValidCoin token contract
    mapping(uint256 => Item) public items;
    uint256 public itemCount;

    event ItemListed(uint256 id, address seller, uint256 price);
    event ItemPurchased(uint256 id, address buyer);

    constructor(IERC20 _validCoin) Ownable(msg.sender) {
        validCoin = _validCoin;
    }

    function listItem(uint256 price) external {
        require(price > 0, "Price must be greater than zero");
        itemCount++;
        items[itemCount] = Item({
            id: itemCount,
            seller: msg.sender,
            price: price,
            isListed: true
        });
        emit ItemListed(itemCount, msg.sender, price);
    }

    function purchaseItem(uint256 id) external {
        Item storage item = items[id];
        require(item.isListed, "Item not listed");
        require(validCoin.transferFrom(msg.sender, item.seller, item.price), "Transfer failed");
        item.isListed = false; // Mark as sold
        emit ItemPurchased(id, msg.sender);
    }

    function withdraw(uint256 amount) external onlyOwner {
        require(validCoin.transfer(msg.sender, amount), "Transfer failed");
    }
}