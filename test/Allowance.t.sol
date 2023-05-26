/// SPDX-License-Identifier CC0-1.0
pragma solidity 0.8.17;

import "forge-std/Test.sol";

import {REAPERSGAMBIT} from "../src/ReapersGambit.sol";
import {WrappedReaper} from "../src/WrappedReaper.sol";
import {WrappedReaperRenderer} from "../src/WrappedReaperRenderer.sol";

contract AllowanceTest is Test {

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

    vm.startPrank(deployerAddress);
      REAPERSGAMBIT reapersGambit = new REAPERSGAMBIT();
      WrappedReaper wrappedReaper = new WrappedReaper(address(reapersGambit), address(new WrappedReaperRenderer()), maxSupply, minTaxBasisPoints, maxTaxBasisPoints, bladeWidth, bladeDiscountBasisPoints);
    vm.stopPrank();

    uint256 expectedPrice = wrappedReaper.scythe(0, PRICE);

    vm.startPrank(deployerAddress);
      reapersGambit.transfer(alice, expectedPrice - 1);
    vm.stopPrank();

    vm.startPrank(alice);
      vm.expectRevert("ERC20: insufficient allowance");
      wrappedReaper.mint(PRICE, expectedPrice);
    vm.stopPrank();

    vm.startPrank(alice);
      reapersGambit.approve(address(wrappedReaper), 2**256 - 1);

      vm.expectRevert("ERC20: transfer amount exceeds balance");
      wrappedReaper.mint(PRICE, expectedPrice);
    vm.stopPrank();

    vm.startPrank(deployerAddress);
      reapersGambit.transfer(alice, 1);
    vm.stopPrank();

    vm.startPrank(alice);
      wrappedReaper.mint(PRICE, expectedPrice);
    vm.stopPrank();

    assertEq(wrappedReaper.balanceOf(alice), 1);

  }

}
