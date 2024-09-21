// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IInference {
    // Should this have a view modifier??
    function generateInference(string memory input) external returns (string memory);
}