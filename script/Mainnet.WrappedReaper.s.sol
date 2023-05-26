// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Script.sol";

import {WrappedReaper} from "../src/WrappedReaper.sol";
import {WrappedReaperRenderer} from "../src/WrappedReaperRenderer.sol";

contract MainnetWrappedReaper is Script {

  function run() public {

    vm.startBroadcast();

    WrappedReaperRenderer wrappedReaperRenderer = new WrappedReaperRenderer();
    address reapersGambitAddress = 0x2C91D908E9fab2dD2441532a04182d791e590f2d;

    uint256 maxSupply = 99;
    uint256 minTax = 900; // 9%
    uint256 maxTax = 3300; // 33%
    uint256 bladeWidth = 40;
    uint256 bladeDiscount = 1200;

    WrappedReaper wrappedReaper = new WrappedReaper(reapersGambitAddress, address(wrappedReaperRenderer), maxSupply, minTax, maxTax, bladeWidth, bladeDiscount);

    vm.stopBroadcast();

  }

}
