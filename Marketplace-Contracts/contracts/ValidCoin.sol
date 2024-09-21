// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ValidCoin is ERC20, Ownable {
    uint256 public cap;

    constructor(
        string memory name, 
        string memory symbol, 
        uint256 initialSupply, 
        uint256 _cap
    ) 
        ERC20(name, symbol) 
        Ownable(msg.sender) // Set the deployer as the owner
    {
        require(initialSupply <= _cap, "Initial supply exceeds cap");
        cap = _cap;
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= cap, "Cap exceeded");
        _mint(to, amount);
    }
}
