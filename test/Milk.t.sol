// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

import "../src/ReapersGambit.sol";
import "../src/WrappedReaper.sol";
import "../src/WrappedReaperRenderer.sol";

contract MilkTest is Test {

  uint256 private constant DECIMALS = 18;
  uint256 private constant PRICE = 1_000_000 * 10 ** DECIMALS;

  function testMilk() public {

    uint256 maxSupply = 250;

    uint256 minTaxBasisPoints = 100;
    uint256 maxTaxBasisPoints = 1000;

    uint256 bladeWidth = maxSupply / 4;
    uint256 bladeDiscountBasisPoints = (maxTaxBasisPoints - minTaxBasisPoints) / 4;

    address deployerAddress = address(1);

    uint256 balance = 2 * 1_000_000 * 10 ** DECIMALS;

    vm.startPrank(deployerAddress);
      REAPERSGAMBIT reapersGambit = new REAPERSGAMBIT();
      WrappedReaper wrappedReaper = new WrappedReaper(address(reapersGambit), address(new WrappedReaperRenderer()), maxSupply, minTaxBasisPoints, maxTaxBasisPoints, bladeWidth, bladeDiscountBasisPoints);
    vm.stopPrank();

    assertEq(reapersGambit.balanceOf(deployerAddress), 999_999_999 * 10 ** DECIMALS);

    for (uint160 i = 0; i < maxSupply + 1; i++) {
      address to = address(2 + i);

      vm.startPrank(deployerAddress);
        reapersGambit.transfer(to, balance);
      vm.stopPrank();
    }

    for (uint160 i = 0; i < maxSupply; i++) {
      address to = address(2 + i);

      vm.startPrank(to);
        reapersGambit.approve(address(wrappedReaper), 2 ** 256 - 1);
        wrappedReaper.mint(PRICE, 2**256 - 1);
      vm.stopPrank();

      assertEq(wrappedReaper.balanceOf(to), 1);
      assertEq(wrappedReaper.ownerOf(i), to);
    }

    assertEq(wrappedReaper.totalSupply(), maxSupply);

    assertEq(reapersGambit.balanceOf(address(uint160(2 + maxSupply))), balance);

    vm.startPrank(address(uint160(2 + maxSupply)));
      reapersGambit.approve(address(wrappedReaper), 2 ** 256 - 1);

      vm.expectRevert("WRG: supply cap reached");
      wrappedReaper.mint(PRICE, 2**256 - 1);
    vm.stopPrank();

    assertEq(reapersGambit.balanceOf(address(uint160(2 + maxSupply))), balance);

    assertEq(wrappedReaper.totalSupply(), maxSupply);

    vm.startPrank(address(uint160(2)));
      vm.expectRevert("ERC721: caller is not token owner or approved");
      wrappedReaper.burn(2, address(uint160(420)));
      wrappedReaper.burn(0, address(uint160(420)));
      vm.expectRevert("ERC721: invalid token ID");
      wrappedReaper.burn(0, address(uint160(420)));
    vm.stopPrank();

    assertEq(reapersGambit.balanceOf(address(uint160(420))), PRICE);
    assertEq(wrappedReaper.balanceOf(address(uint160(2))), 0);
    assertEq(wrappedReaper.totalSupply(), maxSupply - 1);

    vm.startPrank(address(uint160(2 + maxSupply)));
      wrappedReaper.mint(PRICE, 2**256 - 1);
    vm.stopPrank();

    assertEq(wrappedReaper.balanceOf(address(uint160(2 + maxSupply))), 1);
    assertEq(wrappedReaper.ownerOf(maxSupply), address(uint160(2 + maxSupply)));

    for (uint160 i = 1; i < maxSupply + 1; i++) {
      address from = address(2 + i);

      vm.startPrank(from);
        wrappedReaper.burn(i, address(uint160(420)));
      vm.stopPrank();

      assertEq(wrappedReaper.balanceOf(from), 0);
    }

    assertEq(wrappedReaper.totalSupply(), 0);
    assertTrue(reapersGambit.balanceOf(address(wrappedReaper)) == 0);
    assertTrue(reapersGambit.balanceOf(address(0x000000000000000000000000000000000000dEaD)) > 0);
  }

}
