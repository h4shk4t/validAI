// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/MyFirstContract.sol";

contract DeployMyFirstContract is Script {
    function run() external {
        vm.startBroadcast();
        new MyFirstContract();
        vm.stopBroadcast();
    }
}