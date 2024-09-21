// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.20;

/*______     __      __                              __      __ 
 /      \   /  |    /  |                            /  |    /  |
/$$$$$$  | _$$ |_   $$ |____    ______   _______   _$$ |_   $$/   _______ 
$$ |  $$ |/ $$   |  $$      \  /      \ /       \ / $$   |  /  | /       |
$$ |  $$ |$$$$$$/   $$$$$$$  |/$$$$$$  |$$$$$$$  |$$$$$$/   $$ |/$$$$$$$/ 
$$ |  $$ |  $$ | __ $$ |  $$ |$$    $$ |$$ |  $$ |  $$ | __ $$ |$$ |
$$ \__$$ |  $$ |/  |$$ |  $$ |$$$$$$$$/ $$ |  $$ |  $$ |/  |$$ |$$ \_____ 
$$    $$/   $$  $$/ $$ |  $$ |$$       |$$ |  $$ |  $$  $$/ $$ |$$       |
 $$$$$$/     $$$$/  $$/   $$/  $$$$$$$/ $$/   $$/    $$$$/  $$/  $$$$$$$/
*/
/**
 * @author Othentic Labs LTD.
 * @notice Terms of Service: https://www.othentic.xyz/terms-of-service
 */

import './IAvsLogic.sol';
import './IInference.sol';

// 0xf28105aeD885D28B7853c0dBeF4144997CDbD154
contract AvsLogic is IAvsLogic {
    address public attestationCenter;
    address public dkimRegistry;

    constructor (address _attestationCenter) {
        attestationCenter = _attestationCenter;
    }

    // Set this properly
    // function setDKIMRegistry(address _dkimRegistry) external {
    //     dkimRegistry = _dkimRegistry;
    // }

    // Set this properly
    // function afterTaskSubmission(uint16 /* _taskDefinitionId */, address /* _performerAddr */, string calldata _proofOfTask, bool /* _isApproved */, bytes calldata /* _tpSignature */, uint256[2] calldata /* _taSignature */, uint256[] calldata /* _operatorIds */) external {
    //     IDKIMRegistry(dkimRegistry).setDKIMPublicKeyHash("gmail", _proofOfTask);
    // }

    function beforeTaskSubmission(uint16 _taskDefinitionId, address _performerAddr, string calldata _proofOfTask, bool _isApproved, bytes calldata _tpSignature, uint256[2] calldata _taSignature, uint256[] calldata _operatorIds) external {
        // No implementation
    }
}