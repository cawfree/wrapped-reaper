/// SPDX-License-Identifer CC0-1.0
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {REAPERSGAMBIT} from "../src/ReapersGambit.sol";
import {WrappedReaper} from "../src/WrappedReaper.sol";
import {WrappedReaperRenderer} from "../src/WrappedReaperRenderer.sol";

contract DeathTest is Test {

  uint256 private constant DECIMALS = 18;
  uint256 private constant PRICE = 1_000_000 * 10 ** DECIMALS;

  function testDeath() public {
    uint256 maxSupply = 100;

    uint256 minTaxBasisPoints = 100;
    uint256 maxTaxBasisPoints = 1000;

    uint256 bladeWidth = maxSupply / 4;
    uint256 bladeDiscountBasisPoints = (maxTaxBasisPoints - minTaxBasisPoints) / 4;

    address deployerAddress = address(1);

    uint256 balance = 5 * 1_000_000 * 10 ** DECIMALS;

    vm.startPrank(deployerAddress);
      REAPERSGAMBIT reapersGambit = new REAPERSGAMBIT();
      WrappedReaper wrappedReaper = new WrappedReaper(address(reapersGambit), address(new WrappedReaperRenderer()), maxSupply, minTaxBasisPoints, maxTaxBasisPoints, bladeWidth, bladeDiscountBasisPoints);

      reapersGambit.CheatDeath(address(wrappedReaper));
    vm.stopPrank();

    assertEq(reapersGambit.balanceOf(deployerAddress), 999_999_999 * 10 ** DECIMALS);

    address alice = address(2);
    address bob = address(3);

    vm.startPrank(deployerAddress);
      reapersGambit.transfer(alice, balance);
      reapersGambit.transfer(bob, balance);
    vm.stopPrank();

    assertEq(reapersGambit.balanceOf(alice), balance);
    assertEq(reapersGambit.balanceOf(bob), balance);

    vm.startPrank(alice);
      reapersGambit.approve(address(wrappedReaper), 2 ** 256 -1);
    vm.stopPrank();

    vm.startPrank(bob);
      reapersGambit.approve(address(wrappedReaper), 2 ** 256 -1);
    vm.stopPrank();

    assertEq(reapersGambit.KnowDeath(alice), 64801);
    assertEq(reapersGambit.KnowDeath(bob), 64801);
    assertEq(block.number, 1);

    vm.startPrank(bob);

      vm.expectRevert("ERC721: invalid token ID");
      wrappedReaper.tokenURI(0);

      wrappedReaper.mint(PRICE, 2**256 - 1);
    vm.stopPrank();

    assertEq(wrappedReaper.balanceOf(bob), 1);
    assertEq(wrappedReaper.ownerOf(0), bob);

    vm.roll(64800);

    // Test alice can still send funds.
    vm.startPrank(alice);
      reapersGambit.transfer(address(420), 1);
    vm.stopPrank();

    assertEq(reapersGambit.balanceOf(alice), balance - 1);
    assertEq(reapersGambit.balanceOf(address(420)), 1);

    vm.roll(64801);

    vm.startPrank(alice);
      vm.expectRevert("cannot escape death");
      reapersGambit.transfer(address(420), 1);

      vm.expectRevert("cannot escape death");
      wrappedReaper.mint(PRICE, 2**256 - 1);
    vm.stopPrank();

    vm.startPrank(bob);
      vm.expectRevert("cannot escape death");
      reapersGambit.transfer(address(420), 1);

      string memory originalTokenURI = wrappedReaper.tokenURI(0);

      // Verifies we can not only burn after an address would have died,
      // but we can burn to a dead address.
      wrappedReaper.burn(0, alice);

      string memory burnedTokenURI = wrappedReaper.tokenURI(0);

      assertNotEq(originalTokenURI, burnedTokenURI);

      vm.expectRevert("ERC721: invalid token ID");
      wrappedReaper.burn(0, alice);
    vm.stopPrank();

    assertEq(reapersGambit.balanceOf(alice), (balance - 1) + PRICE);

  }

}
