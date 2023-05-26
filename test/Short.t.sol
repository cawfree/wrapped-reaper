// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

import "../src/WrappedReaperUtils.sol";

contract ShortTest is Test {

  function testShort() public {
    assertEq(WrappedReaperUtils.short(address(0)), "000000");
    assertEq(WrappedReaperUtils.short(address(0x533Ec09AbfA6D06A94C591FB2dC67630f3Eccd06)), "533EC0");
    assertEq(WrappedReaperUtils.short(address(0x726a886Bb8FAf6fA85Fe4FB855970da06e5B86E9)), "726A88");
  }

}
