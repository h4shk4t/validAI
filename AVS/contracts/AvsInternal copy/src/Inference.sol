// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IInference.sol";

contract Inference is IInference {
    address public avsLogic;

    constructor(address _avsLogic) {
        avsLogic = _avsLogic;
    }

    event InferenceRequest(string prompt);
    function generateInference(string memory input) public returns (string memory) {
        require(
            msg.sender == avsLogic,
            "Swarm: Only AVS Logic can request inference for prompt"
        );
        emit InferenceRequest(input);
        // return "This is a placeholder inference" + input;
        return input;
    }
}