/// SPDX-License-Identifier CC0-1.0
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {REAPERSGAMBIT} from "../src/ReapersGambit.sol";
import {WrappedReaper} from "../src/WrappedReaper.sol";
import {WrappedReaperRenderer} from "../src/WrappedReaperRenderer.sol";

import {Base64Decoder} from "./Base64Decoder.sol";

contract ArtTest is Test {

  function testSaturation() public {
    WrappedReaper wrappedReaper = new WrappedReaper(address(new REAPERSGAMBIT()), address(new WrappedReaperRenderer()), 0, 0, 0, 0, 0);

    assertEq(wrappedReaper.saturation(0), 0);
    assertEq(wrappedReaper.saturation(2 ** 256 - 1), 3);

    assertEq(wrappedReaper.saturation(wrappedReaper.minStake() - 0), 0);
    assertEq(wrappedReaper.saturation(wrappedReaper.maxStake() + 0), 3);
    assertEq(wrappedReaper.saturation(wrappedReaper.maxStake() + 1), 3);

    assertEq(wrappedReaper.saturation(7_000_001 * 10 ** wrappedReaper.decimals()), 3);
    assertEq(wrappedReaper.saturation(7_000_000 * 10 ** wrappedReaper.decimals()), 3);
    assertEq(wrappedReaper.saturation(6_999_999 * 10 ** wrappedReaper.decimals()), 2);
    assertEq(wrappedReaper.saturation(3_000_000 * 10 ** wrappedReaper.decimals()), 2);
    assertEq(wrappedReaper.saturation(2_999_999 * 10 ** wrappedReaper.decimals()), 1);
    assertEq(wrappedReaper.saturation(1_000_000 * 10 ** wrappedReaper.decimals()), 1);
    assertEq(wrappedReaper.saturation(999_999 * 10 ** wrappedReaper.decimals()), 0);

  }

  function testPhase() public {
    WrappedReaper wrappedReaper = new WrappedReaper(address(new REAPERSGAMBIT()), address(new WrappedReaperRenderer()), 0, 0, 0, 0, 0);

    assertEq(wrappedReaper.phase(2 ** 256 - 1, 0), 0);

    assertEq(wrappedReaper.phase(64800, 0), 0);
    assertEq(wrappedReaper.phase(64800 - 1, 0), 0);

    assertEq(wrappedReaper.phase(43801, 0), 0);
    assertEq(wrappedReaper.phase(43800, 0), 1);

    assertEq(wrappedReaper.phase(22801, 0), 1);
    assertEq(wrappedReaper.phase(22800, 0), 2);

    assertEq(wrappedReaper.phase(1801, 0), 2);
    assertEq(wrappedReaper.phase(1800, 0), 3);

    assertEq(wrappedReaper.phase(999, 0), 3);
    assertEq(wrappedReaper.phase(1, 0), 3);
    assertEq(wrappedReaper.phase(0, 0), 3);
  }

  function testGenerativeColors() public {

    WrappedReaperRenderer wrappedReaperRenderer = new WrappedReaperRenderer();

    for (uint256 i = 0; i < 4; i += 1) {
      wrappedReaperRenderer.backgroundColor(i);
      wrappedReaperRenderer.shadowColor(i);
      wrappedReaperRenderer.blockDeepColor(i);
      wrappedReaperRenderer.blockAccentColor(i);
      wrappedReaperRenderer.blockFillColor(i);
    }

  }

  function testSubstring() public {

    WrappedReaperRenderer wrappedReaperRenderer = new WrappedReaperRenderer();

    assertEq(wrappedReaperRenderer.substring("Hello", 0, 5), "Hello");
    assertEq(wrappedReaperRenderer.substring("Hello", 0, 4), "Hell");
    assertEq(wrappedReaperRenderer.substring("Hello", 0, 3), "Hel");
    assertEq(wrappedReaperRenderer.substring("Hello", 0, 2), "He");
    assertEq(wrappedReaperRenderer.substring("Hello", 0, 1), "H");
    assertEq(wrappedReaperRenderer.substring("Hello", 0, 0), "");
    assertEq(wrappedReaperRenderer.substring("H", 1, 1), "");

    vm.expectRevert();
    assertEq(wrappedReaperRenderer.substring("H", 1, 0), "");

    vm.expectRevert();
    wrappedReaperRenderer.substring("", 0, 1);

    assertEq(wrappedReaperRenderer.substring("123456789", 0, 3), "123");
    assertEq(wrappedReaperRenderer.substring("123456789", 3, 6), "456");
    assertEq(wrappedReaperRenderer.substring("123456789", 6, 9), "789");
  }

  function testGrouping() public {
    WrappedReaperRenderer wrappedReaperRenderer = new WrappedReaperRenderer();
    WrappedReaper wrappedReaper = new WrappedReaper(address(new REAPERSGAMBIT()), address(wrappedReaperRenderer), 0, 0, 0, 0, 0);

    vm.expectRevert();
    wrappedReaperRenderer.grouping(10_000_000_000);
    vm.expectRevert();
    wrappedReaperRenderer.grouping(1_000_000_000);

    assertEq(wrappedReaperRenderer.grouping(100_000_000), "100,000,000");
    assertEq(wrappedReaperRenderer.grouping(123_456_789), "123,456,789");
    assertEq(wrappedReaperRenderer.grouping(23_456_789), "23,456,789");
    assertEq(wrappedReaperRenderer.grouping(3_456_789), "3,456,789");
    assertEq(wrappedReaperRenderer.grouping(456_789), "456,789");
    assertEq(wrappedReaperRenderer.grouping(56_789), "56,789");
    assertEq(wrappedReaperRenderer.grouping(6_789), "6,789");
    assertEq(wrappedReaperRenderer.grouping(789), "789");
    assertEq(wrappedReaperRenderer.grouping(89), "89");
    assertEq(wrappedReaperRenderer.grouping(9), "9");
    assertEq(wrappedReaperRenderer.grouping(0), "0");

    assertEq(wrappedReaperRenderer.grouping(wrappedReaper.minStake() / 10 ** wrappedReaper.decimals()), "666,666");
    assertEq(wrappedReaperRenderer.grouping(wrappedReaper.maxStake() / 10 ** wrappedReaper.decimals()), "100,000,000");
  }

  // TODO: iterate all with large values etc
  function testSaturationAndPhasePermutations() public {

    WrappedReaper wrappedReaper = new WrappedReaper(address(new REAPERSGAMBIT()), address(new WrappedReaperRenderer()), 16, 0, 0, 0, 0);

    uint256 tokenId = wrappedReaper.maxSupply() * 10;

    // merge
    uint256 mintBlock = 15537351;
    // vb
    address minter = 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045;

    // idk
    uint256 timestamp = 1546360800;

    for (uint256 i = 0; i < 4; i += 1) {

      uint256 stake = i == 0
        ? wrappedReaper.minStake()
        : i == 1
        ? 1_000_000 * 10 ** wrappedReaper.decimals()
        : i == 2
        ? 3_000_000 * 10 ** wrappedReaper.decimals()
        : 7_000_000 * 10 ** wrappedReaper.decimals();

      for (uint256 j = 0; j < 4; j += 1) {

        uint256 death = j == 0
          ? 1800
          : j == 1
          ? 22800
          : j == 2
          ? 43800
          : 64800;

        uint256 deathBlock = mintBlock + death;

        string memory imageData = wrappedReaper.barTokenURIData(tokenId, stake, deathBlock, mintBlock, minter, timestamp);

        bytes memory inputBytes = abi.encodePacked(imageData);
        bytes memory outputBytes = new bytes(inputBytes.length - 29);

        for (uint256 k = 29; k < inputBytes.length; k++)
          outputBytes[k - 29] = inputBytes[k];

        console.log(string(Base64Decoder.decode(string(outputBytes))));

      }
    }
  }

  function testBurns() public {

    WrappedReaper wrappedReaper = new WrappedReaper(address(new REAPERSGAMBIT()), address(new WrappedReaperRenderer()), 16, 0, 0, 0, 0);

    uint256 tokenId = wrappedReaper.maxSupply() * 10;

    for (uint256 i = 0; i < 4; i += 1) {

      uint256 stake = i == 0
      ? wrappedReaper.minStake()
      : i == 1
      ? 1_000_000 * 10 ** wrappedReaper.decimals()
      : i == 2
      ? 3_000_000 * 10 ** wrappedReaper.decimals()
      : 7_000_000 * 10 ** wrappedReaper.decimals();


      string memory imageData = wrappedReaper.burnTokenURIData(tokenId, stake);

      bytes memory inputBytes = abi.encodePacked(imageData);
      bytes memory outputBytes = new bytes(inputBytes.length - 29);

      for (uint256 k = 29; k < inputBytes.length; k++)
        outputBytes[k - 29] = inputBytes[k];

      //console.log(string(Base64Decoder.decode(string(outputBytes))));

    }
  }

  function testProximity() public {
    WrappedReaper wrappedReaper = new WrappedReaper(address(new REAPERSGAMBIT()), address(new WrappedReaperRenderer()), 0, 0, 0, 0, 0);

    assertEq(wrappedReaper.proximity(17395115 + 64800, 17395115 + 0), 0);
    assertEq(wrappedReaper.proximity(17395115 + 64800, 17395115 + 64800), 64800);

  }

}
