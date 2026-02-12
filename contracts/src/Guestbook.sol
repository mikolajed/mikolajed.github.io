// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Guestbook {
    struct Entry {
        address signer;
        string message;
        uint256 timestamp;
    }

    address public immutable owner;
    bytes public ownerPublicKey;

    Entry[] public entries;
    mapping(address => bool) public hasSigned;
    
    event NewEntry(address indexed signer, string message, uint256 timestamp);
    event PublicKeyUpdated(bytes key);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setPublicKey(bytes calldata _key) external onlyOwner {
        require(ownerPublicKey.length == 0, "Key already set");
        ownerPublicKey = _key;
        emit PublicKeyUpdated(_key);
    }

    function sign(string calldata _message) external {
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(bytes(_message).length <= 140, "Message too long");

        entries.push(Entry({
            signer: msg.sender,
            message: _message,
            timestamp: block.timestamp
        }));

        hasSigned[msg.sender] = true;
        
        emit NewEntry(msg.sender, _message, block.timestamp);
    }

    function getEntries(uint256 _offset, uint256 _limit) external view returns (Entry[] memory) {
        uint256 total = entries.length;
        if (_offset >= total) {
            return new Entry[](0);
        }
        uint256 end = _offset + _limit;
        if (end > total) {
            end = total;
        }
        uint256 count = end - _offset;
        Entry[] memory page = new Entry[](count);
        for (uint256 i = 0; i < count; i++) {
            page[i] = entries[_offset + i];
        }
        return page;
    }

    function getEntriesCount() external view returns (uint256) {
        return entries.length;
    }
}
