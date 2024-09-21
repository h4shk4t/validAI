// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/MyFirstContract.sol";

contract MyFirstContractTest is Test {
    MyFirstContract public myFirstContract;

    function setUp() public {
        myFirstContract = new MyFirstContract();
    }

    function testIncrement() public {
        myFirstContract.increment();
        assertEq(myFirstContract.count(), 1);
    }

    function testDecrement() public {
        myFirstContract.increment();
        myFirstContract.decrement();
        assertEq(myFirstContract.count(), 0);
    }
}
