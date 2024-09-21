// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MarketplaceEscrow is Ownable {
    IERC20 public token;
    
    enum EscrowStatus { Pending, Completed, Refunded }
    
    struct Escrow {
        uint256 itemId;
        uint256 price;
        address buyer;
        address seller;
        EscrowStatus status;
        uint256 createdAt;  // Track creation time for weekly payments
    }

    mapping(uint256 => Escrow) public escrows;
    mapping(uint256 => uint256) public downloads;  // Track downloads for each item

    event EscrowCreated(uint256 itemId, address buyer, address seller, uint256 price);
    event EscrowCompleted(uint256 itemId);
    event EscrowRefunded(uint256 itemId);

    constructor(IERC20 _token) Ownable(msg.sender) {
        token = _token;
    }

    modifier onlyBuyer(uint256 itemId) {
        require(escrows[itemId].buyer == msg.sender, "Only buyer can confirm");
        _;
    }

    modifier onlySeller(uint256 itemId) {
        require(escrows[itemId].seller == msg.sender, "Only seller can withdraw");
        _;
    }

    // Buyer creates an escrow when purchasing an item
    function createEscrow(uint256 itemId, address seller, uint256 price) external {
        require(escrows[itemId].status == EscrowStatus.Pending, "Escrow already exists");
        escrows[itemId] = Escrow(itemId, price, msg.sender, seller, EscrowStatus.Pending, block.timestamp);
        require(token.transferFrom(msg.sender, address(this), price), "Transfer failed");
        emit EscrowCreated(itemId, msg.sender, seller, price);
    }

    // Release weekly payments after 7 days
    function releaseWeeklyPayment(uint256 itemId) external {
        require(escrows[itemId].status == EscrowStatus.Pending, "Escrow not pending");
        require(block.timestamp >= escrows[itemId].createdAt + 7 days, "Not yet eligible for weekly release");
        require(token.transfer(escrows[itemId].seller, escrows[itemId].price), "Transfer failed");
        escrows[itemId].status = EscrowStatus.Completed;
        emit EscrowCompleted(itemId);
    }

    // Increment download count and release funds if 1000 downloads are reached
    function incrementDownloads(uint256 itemId) external {
        downloads[itemId] += 1;
        if (downloads[itemId] >= 1000 && escrows[itemId].status == EscrowStatus.Pending) {
            releasePaymentOnDownloads(itemId);
        }
    }

    function releasePaymentOnDownloads(uint256 itemId) internal {
        require(escrows[itemId].status == EscrowStatus.Pending, "Escrow not pending");
        require(token.transfer(escrows[itemId].seller, escrows[itemId].price), "Transfer failed");
        escrows[itemId].status = EscrowStatus.Completed;
        emit EscrowCompleted(itemId);
    }

    // Seller can manually request funds, paying gas fees themselves
    function requestFunds(uint256 itemId) external onlySeller(itemId) {
        require(escrows[itemId].status == EscrowStatus.Pending, "Escrow not pending");
        require(token.transfer(escrows[itemId].seller, escrows[itemId].price), "Transfer failed");
        escrows[itemId].status = EscrowStatus.Completed;
        emit EscrowCompleted(itemId);
    }
}