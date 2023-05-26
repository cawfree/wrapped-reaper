// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Script.sol";

import {REAPERSGAMBIT} from "../src/ReapersGambit.sol";
import {WrappedReaper} from "../src/WrappedReaper.sol";
import {WrappedReaperRenderer} from "../src/WrappedReaperRenderer.sol";

contract LocalScript is Script {

  uint256 private constant DECIMALS = 18;
  uint256 private constant PRICE = 1_000_000 * 10 ** DECIMALS;

  function run() public {
    vm.startBroadcast();

    uint256 maxSupply = 1000;

    uint256 minTaxBasisPoints = 100;
    uint256 maxTaxBasisPoints = 1000;

    uint256 bladeWidth = maxSupply / 4;
    uint256 bladeDiscountBasisPoints = (maxTaxBasisPoints - minTaxBasisPoints) / 4;

    address tester = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    REAPERSGAMBIT reapersGambit = new REAPERSGAMBIT();
    WrappedReaperRenderer wrappedReaperRenderer = new WrappedReaperRenderer();
    WrappedReaper wrappedReaper = new WrappedReaper(address(reapersGambit), address(wrappedReaperRenderer), maxSupply, minTaxBasisPoints, maxTaxBasisPoints, bladeWidth, bladeDiscountBasisPoints);

    reapersGambit.CheatDeath(address(wrappedReaper));
    require(reapersGambit.transfer(tester, 10_000_000 * 10 ** DECIMALS));

    vm.stopBroadcast();
  }

}
