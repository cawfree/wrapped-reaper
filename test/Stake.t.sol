/// SPDX-License-Identifier CC0-1.0
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {REAPERSGAMBIT} from "../src/ReapersGambit.sol";
import {WrappedReaper} from "../src/WrappedReaper.sol";
import {WrappedReaperRenderer} from "../src/WrappedReaperRenderer.sol";

contract StakeTest is Test {

  uint256 private constant DECIMALS = 18;

  function testMinStake() public {

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

      uint256 minStake = wrappedReaper.minStake();

      reapersGambit.transfer(alice, minStake * 5);
      reapersGambit.transfer(bob, minStake * 5);
    vm.stopPrank();

    vm.startPrank(alice);
      reapersGambit.approve(address(wrappedReaper), 2**256 -1);

      vm.expectRevert("WRG: invalid stake");
      wrappedReaper.mint(minStake - 1, 2**256 - 1);

      vm.expectRevert("WRG: invalid stake");
      wrappedReaper.mint(minStake, minStake - 1);

      wrappedReaper.mint(minStake, wrappedReaper.currentScythe(minStake));

      assertEq(reapersGambit.balanceOf(address(wrappedReaper)), minStake);
      assertEq(wrappedReaper.balanceOf(alice), 1);
    vm.stopPrank();

    vm.startPrank(bob);
      reapersGambit.approve(address(wrappedReaper), 2**256 -1);
      wrappedReaper.mint(minStake * 2, 2**256 - 1);
      assertEq(wrappedReaper.balanceOf(bob), 1);
      assertEq(reapersGambit.balanceOf(address(wrappedReaper)), minStake * 3);
    vm.stopPrank();

    vm.startPrank(alice);
      wrappedReaper.burn(0, address(420));
      assertEq(wrappedReaper.balanceOf(alice), 0);
      assertEq(reapersGambit.balanceOf(address(420)), minStake);
    vm.stopPrank();

    vm.startPrank(bob);
      wrappedReaper.burn(1, address(420));
      assertEq(wrappedReaper.balanceOf(bob), 0);
      assertEq(reapersGambit.balanceOf(address(420)), minStake * 3);
    vm.stopPrank();

    assertEq(reapersGambit.balanceOf(address(wrappedReaper)), 0);
  }

  function testMaxStake() public {
    uint256 maxSupply = 100;
    uint256 minTaxBasisPoints = 100;
    uint256 maxTaxBasisPoints = 1000;
    uint256 bladeWidth = maxSupply / 4;
    uint256 bladeDiscountBasisPoints = (maxTaxBasisPoints - minTaxBasisPoints) / 4;

    address deployerAddress = address(1);
    address alice = address(2);

    vm.startPrank(deployerAddress);
    REAPERSGAMBIT reapersGambit = new REAPERSGAMBIT();
    WrappedReaper wrappedReaper = new WrappedReaper(address(reapersGambit), address(new WrappedReaperRenderer()),  maxSupply, minTaxBasisPoints, maxTaxBasisPoints, bladeWidth, bladeDiscountBasisPoints);

    uint256 maxStake = wrappedReaper.maxStake();

    reapersGambit.transfer(alice, maxStake * 5);
    vm.stopPrank();

    vm.startPrank(alice);
    reapersGambit.approve(address(wrappedReaper), 2**256 -1);

    vm.expectRevert("WRG: invalid stake");
    wrappedReaper.mint(maxStake + 1, 2**256 - 1);

    vm.expectRevert("WRG: invalid stake");
    wrappedReaper.mint(maxStake, maxStake - 1);

    uint256 valueForMaxStake = wrappedReaper.currentScythe(maxStake);

    vm.expectRevert("WRG: frontrun protection");
    wrappedReaper.mint(maxStake, valueForMaxStake - 1);

    wrappedReaper.mint(maxStake, valueForMaxStake);

    assertEq(reapersGambit.balanceOf(address(wrappedReaper)), maxStake);
    assertEq(wrappedReaper.balanceOf(alice), 1);
    vm.stopPrank();

    vm.startPrank(alice);
    wrappedReaper.burn(0, address(420));
    assertEq(wrappedReaper.balanceOf(alice), 0);
    assertEq(reapersGambit.balanceOf(address(420)), maxStake);
    vm.stopPrank();

    assertEq(reapersGambit.balanceOf(address(wrappedReaper)), 0);
  }

}
