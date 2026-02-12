// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Guestbook} from "../src/Guestbook.sol";
import {VisitorPass} from "../src/VisitorPass.sol";

contract Deploy is Script {
    function setUp() public {}

    function run() public returns (Guestbook, VisitorPass) {
        vm.startBroadcast();

        Guestbook guestbook = new Guestbook();
        console.log("Guestbook deployed at:", address(guestbook));

        VisitorPass pass = new VisitorPass();
        console.log("VisitorPass deployed at:", address(pass));

        vm.stopBroadcast();

        return (guestbook, pass);
    }
}
