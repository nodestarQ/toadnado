// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract scrollMessengerMock {
    struct message {
        address _to;
        uint256 _value;
        bytes _message;
        uint256 _gasLimit;
    }
    mapping(uint256 => message) messages;
    uint256 lastMessageIndex = 0;

    address public otherMessenger;

    constructor(address _otherMessenger) {
        otherMessenger = _otherMessenger;
    }

    function setOtherMessenger(address _otherMessenger) public {
        otherMessenger = _otherMessenger;
    }

    struct L2MessageProof {
        // The index of the batch where the message belongs to.
        uint256 batchIndex;
        // Concatenation of merkle proof for withdraw merkle trie.
        bytes merkleProof;
    } 
    mapping(bytes32 => bool) isMessageExecuted;

    /// @notice Emitted when a cross domain message is relayed successfully.
    /// @param messageHash The hash of the message.
    event RelayedMessage(bytes32 indexed messageHash);

    /// @notice Emitted when a cross domain message is failed to relay.
    /// @param messageHash The hash of the message.
    event FailedRelayedMessage(bytes32 indexed messageHash);

    address public xDomainMessageSender;

    function sendMessage(
        address _to,
        uint256 _value,
        bytes calldata _message,
        uint256 _gasLimit,
        address _refundAddress
    ) public payable {
        // uint256 _messageNonce = 0;
        // bytes memory _xDomainCalldata = _encodeXDomainCalldata(msg.sender, _to, _value, _messageNonce, _message);

        // // record the message hash for future use.
        // bytes32 _xDomainCalldataHash = keccak256(_xDomainCalldata);
        // messages[_xDomainCalldataHash] = _xDomainCalldata;

        // not sending the message over because am lazy
        lastMessageIndex ++;
        messages[lastMessageIndex] = message(_to, _value, _message, _gasLimit);
        payable(otherMessenger).transfer(_value);
        payable(_refundAddress).transfer(_value - msg.value);
    }

    function getLastMessage() public view returns (message memory) {
        return messages[lastMessageIndex];
    }

    receive() external payable {}

    /// @dev Internal function to generate the correct cross domain calldata for a message.
    /// @param _sender Message sender address.
    /// @param _target Target contract address.
    /// @param _value The amount of ETH pass to the target.
    /// @param _messageNonce Nonce for the provided message.
    /// @param _message Message to send to the target.
    /// @return ABI encoded cross domain calldata.
    function _encodeXDomainCalldata(
        address _sender,
        address _target,
        uint256 _value,
        uint256 _messageNonce,
        bytes memory _message
    ) internal pure returns (bytes memory) {
        return
            abi.encodeWithSignature(
                "relayMessage(address,address,uint256,uint256,bytes)",
                _sender,
                _target,
                _value,
                _messageNonce,
                _message
            );
    }

    // you can relay messages that where never send before
    function relayMessageWithProof(
        address _from,
        address _to,
        uint256 _value,
        uint256 _nonce,
        bytes memory _message,
        L2MessageProof memory _proof
    ) public {
        bytes32 _xDomainCalldataHash = keccak256(
            _encodeXDomainCalldata(_from, _to, _value, _nonce, _message)
        );
        // require(!isMessageExecuted[_xDomainCalldataHash], "Message was already successfully executed");

        // {
        //     require(IScrollChain(rollup).isBatchFinalized(_proof.batchIndex), "Batch is not finalized");
        //     bytes32 _messageRoot = IScrollChain(rollup).withdrawRoots(_proof.batchIndex);
        //     require(
        //         WithdrawTrieVerifier.verifyMerkleProof(_messageRoot, _xDomainCalldataHash, _nonce, _proof.merkleProof),
        //         "Invalid proof"
        //     );
        // }

        // @note check more `_to` address to avoid attack in the future when we add more gateways.
        // require(_to != messageQueue, "Forbid to call message queue");
        // _validateTargetAddress(_to);

        // @note This usually will never happen, just in case.
        // require(_from != xDomainMessageSender, "Invalid message sender");

        xDomainMessageSender = _from;
        // payable(_to).transfer(_value);
        require(address(this).balance >= _value, "not enough eth :(");
        (bool success, ) = payable(_to).call{value: _value}(_message);
        require(success, "waaaa bridging failed D:");
        // reset value to refund gas.
        xDomainMessageSender = address(0); //ScrollConstants.DEFAULT_XDOMAIN_MESSAGE_SENDER;

        if (success) {
            //isMessageExecuted[_xDomainCalldataHash] = true;
            emit RelayedMessage(_xDomainCalldataHash);
        } else {
            emit FailedRelayedMessage(_xDomainCalldataHash);
        }
    }
}
