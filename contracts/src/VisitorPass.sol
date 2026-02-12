// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract VisitorPass is ERC721 {
    using Strings for uint256;
    using Strings for address;

    uint256 public nextTokenId;
    mapping(address => bool) public hasMinted;
    mapping(address => uint256) public visitorTokenId;

    constructor() ERC721("Mikolaj's Visitor Pass", "VISITOR") {}

    function mint() external {
        require(!hasMinted[msg.sender], "One pass per visitor!");
        
        uint256 tokenId = nextTokenId++;
        hasMinted[msg.sender] = true;
        visitorTokenId[msg.sender] = tokenId;
        _safeMint(msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        address owner = ownerOf(tokenId);
        
        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<style>.base { fill: white; font-family: monospace; font-size: 14px; }</style>',
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="40%" class="base" text-anchor="middle">MIKOLAJ.VISITOR</text>',
            '<text x="50%" y="50%" class="base" text-anchor="middle">PASS #', tokenId.toString(), '</text>',
            '<text x="50%" y="60%" class="base" text-anchor="middle">', _toShortAddress(owner), '</text>',
            '</svg>'
        ));

        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{"name": "Visitor Pass #', tokenId.toString(), '",',
            '"description": "A memento from visiting Mikolaj\'s digital garden.",',
            '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '"}'
        ))));

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function _toShortAddress(address addr) internal pure returns (string memory) {
        string memory str = Strings.toHexString(uint160(addr), 20);
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(10);
        
        // "0x"
        result[0] = strBytes[0];
        result[1] = strBytes[1];
        
        // First 4 hex chars
        result[2] = strBytes[2];
        result[3] = strBytes[3];
        result[4] = strBytes[4];
        result[5] = strBytes[5];
        
        // ".."
        result[6] = 0x2e;
        result[7] = 0x2e;
        
        // Last 2 hex chars (indices 40 and 41)
        result[8] = strBytes[40];
        result[9] = strBytes[41];
        
        return string(result);
    }
}
