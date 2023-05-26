// SPDX-License-Identifier CC0-1.0
pragma solidity 0.8.17;

import "forge-std/Test.sol";

import {REAPERSGAMBIT} from "../src/ReapersGambit.sol";
import {WrappedReaper} from "../src/WrappedReaper.sol";
import {WrappedReaperRenderer} from "../src/WrappedReaperRenderer.sol";

contract Beaucoup is Test {

  uint256 private constant DECIMALS = 18;
  uint256 private constant PRICE = 1_000_000 * 10 ** DECIMALS;

  function testCycles() public {
    uint256 maxSupply = 999;
    uint256 minTax = 0;
    uint256 maxTax = 0;
    uint256 bladeWidth = 0;
    uint256 bladeDiscount = 0;

    address deployer = address(1);

    vm.startPrank(deployer);
      REAPERSGAMBIT reapersGambit = new REAPERSGAMBIT();
      WrappedReaper wrappedReaper = new WrappedReaper(address(reapersGambit), address(new WrappedReaperRenderer()), maxSupply, minTax, maxTax, bladeWidth, bladeDiscount);
    vm.stopPrank();

    for (uint i = 0; i < maxSupply;  i += 1) {
      address minter = address(uint160(2 + i));
      vm.startPrank(deployer);
        reapersGambit.transfer(minter, PRICE);
      vm.stopPrank();

      vm.startPrank(minter);
        reapersGambit.approve(address(wrappedReaper), 2 ** 256 - 1);
        wrappedReaper.mint(PRICE, wrappedReaper.currentScythe(PRICE));
        assertEq(reapersGambit.balanceOf(minter), 0);
        assertEq(wrappedReaper.balanceOf(minter), 1);
        assertEq(wrappedReaper.ownerOf(i), minter);
      vm.stopPrank();

      assertEq(wrappedReaper.ownerOf(i), minter);
    }

    assertEq(wrappedReaper.totalSupply(), maxSupply);

    for (uint i = 0; i < maxSupply; i += 1) {
      address minter = address(uint160(2 + i));

      vm.startPrank(minter);
        wrappedReaper.burn(i, minter);
        assertEq(wrappedReaper.balanceOf(minter), 0);
        assertEq(reapersGambit.balanceOf(minter), PRICE);
      vm.stopPrank();
    }

    for (uint i = 0; i < maxSupply; i += 1) {
      address minter = address(uint160(2 + i));

      vm.startPrank(minter);
        wrappedReaper.mint(PRICE, wrappedReaper.currentScythe(PRICE));
        assertEq(wrappedReaper.balanceOf(minter), 1);
        assertEq(reapersGambit.balanceOf(minter), 0);
        assertEq(reapersGambit.balanceOf(address(wrappedReaper)), (i + 1) * PRICE);
        assertEq(wrappedReaper.ownerOf(i + maxSupply), minter);
      vm.stopPrank();
    }

    assertEq(wrappedReaper.totalSupply(), maxSupply);

  }

}
