// SPDX-License-Identifier CC0-1.0
pragma solidity 0.8.17;

import "forge-std/Test.sol";

import {REAPERSGAMBIT} from "../src/ReapersGambit.sol";
import {WrappedReaper} from "../src/WrappedReaper.sol";
import {WrappedReaperRenderer} from "../src/WrappedReaperRenderer.sol";

contract Immortal is Test {

  function testMintByImmortalAddress() public {

    address deployerAccount = address(1);
    address immortalAccount = address(2);
    address nonImmortalAccount = address(3);

    vm.startPrank(deployerAccount);
      REAPERSGAMBIT reapersGambit = new REAPERSGAMBIT();
      WrappedReaper wrappedReaper = new WrappedReaper(address(reapersGambit), address(new WrappedReaperRenderer()), 10, 0, 0, 0, 0);

      reapersGambit.transfer(immortalAccount, 100_000_000 * 10 ** reapersGambit.decimals());
      reapersGambit.transfer(nonImmortalAccount, 100_000_000 * 10 ** reapersGambit.decimals());

      reapersGambit.CheatDeath(immortalAccount);
    vm.stopPrank();

    uint256 minStake = wrappedReaper.minStake();
    uint256 currentScythe = wrappedReaper.currentScythe(minStake);

    vm.startPrank(immortalAccount);
      reapersGambit.approve(address(wrappedReaper), 2**256 - 1);

      vm.expectRevert("cannot escape death");
      wrappedReaper.mint(minStake, currentScythe);
    vm.stopPrank();

    vm.startPrank(nonImmortalAccount);
      reapersGambit.approve(address(wrappedReaper), 2**256 - 1);

      wrappedReaper.mint(minStake, currentScythe);
      assertEq(wrappedReaper.balanceOf(nonImmortalAccount), 1);
    vm.stopPrank();

  }

}
