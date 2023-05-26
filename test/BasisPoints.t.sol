/// SPDX-License-Identifier CC0-1.0
pragma solidity 0.8.17;

import "forge-std/Test.sol";

import {REAPERSGAMBIT} from "../src/ReapersGambit.sol";
import {WrappedReaper} from "../src/WrappedReaper.sol";
import {WrappedReaperRenderer} from "../src/WrappedReaperRenderer.sol";

contract BasisPointsTest is Test {

  uint256 private constant DECIMALS = 18;
  uint256 private constant PRICE = 1_000_000 * 10 ** DECIMALS;

  function testBasisPoints() public {
    uint256 maxSupply = 1000;
    uint256 minTax = PRICE / 100;
    uint256 maxTax = PRICE / 10;
    uint256 bladeWidth = maxSupply / 4;
    uint256 bladeDiscount = (maxTax - minTax) / 4;
    WrappedReaper wrappedReaper = new WrappedReaper(address(new REAPERSGAMBIT()), address(new WrappedReaperRenderer()), maxSupply, minTax, maxTax, bladeWidth, bladeDiscount);

    // 2.5 %
    assertEq(wrappedReaper.costBasis(1000 * 10 ** DECIMALS, 250), 25 * 10 ** DECIMALS);
    // 0.01 %
    assertEq(wrappedReaper.costBasis(10000, 1), 1);
    // 1%
    assertEq(wrappedReaper.costBasis(10000, 100), 100);
    // 50%
    assertEq(wrappedReaper.costBasis(10000, 5000), 5000);
    // 100%
    assertEq(wrappedReaper.costBasis(10000, 10000), 10000);
  }

}
