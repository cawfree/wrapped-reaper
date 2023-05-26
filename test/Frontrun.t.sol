/// SPDX-License-Identifier CC0-1.0
pragma solidity 0.8.17;

import "forge-std/Test.sol";

import {REAPERSGAMBIT} from "../src/ReapersGambit.sol";
import {WrappedReaper} from "../src/WrappedReaper.sol";
import {WrappedReaperRenderer} from "../src/WrappedReaperRenderer.sol";

contract FrontrunTest is Test {

  uint256 private constant DECIMALS = 18;
  uint256 private constant PRICE = 1_000_000 * 10 ** DECIMALS;

  function testFrontRunProtection() public {

    uint256 maxSupply = 100;
    uint256 minTaxBasisPoints = 100;
    uint256 maxTaxBasisPoints = 1000;
    uint256 bladeWidth = maxSupply / 4;
    uint256 bladeDiscountBasisPoints = (maxTaxBasisPoints - minTaxBasisPoints) / 4;

    address deployerAddress = address(1);
    address alice = address(2);
    address bob = address(3);

    vm.startPrank(deployerAddress);
      REAPERSGAMBIT reapersGambit = new REAPERSGAMBIT();
      WrappedReaper wrappedReaper = new WrappedReaper(address(reapersGambit), address(new WrappedReaperRenderer()), maxSupply, minTaxBasisPoints, maxTaxBasisPoints, bladeWidth, bladeDiscountBasisPoints);

      reapersGambit.transfer(alice, 5_000_000 * 10 ** DECIMALS);
      reapersGambit.transfer(bob, 5_000_000 * 10 ** DECIMALS);
    vm.stopPrank();

    vm.startPrank(alice);
      reapersGambit.approve(address(wrappedReaper), 2**256 - 1);
    vm.stopPrank();

    vm.startPrank(bob);
      reapersGambit.approve(address(wrappedReaper), 2**256 - 1);
    vm.stopPrank();

    uint256 expectedPrice = wrappedReaper.scythe(0, PRICE);

    vm.startPrank(alice);
      wrappedReaper.mint(PRICE, expectedPrice);
    vm.stopPrank();

    assertEq(wrappedReaper.balanceOf(alice), 1);

    vm.startPrank(bob);
      vm.expectRevert("WRG: frontrun protection");
      wrappedReaper.mint(PRICE, expectedPrice);
    vm.stopPrank();

  }

}
