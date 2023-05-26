// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

import "../src/WrappedReaper.sol";
import "../src/WrappedReaperRenderer.sol";
import "../src/ReapersGambit.sol";

contract ScytheTest is Test {

  uint256 private constant DECIMALS = 18;
  uint256 private constant PRICE = 1_000_000 * 10 ** DECIMALS;

  function _renderScythe(address wrappedReaperAddress, uint256 forStake) private view {
    string memory result = "";
    WrappedReaper wrappedReaper = WrappedReaper(wrappedReaperAddress);

    for (uint i = 0; i < wrappedReaper.maxSupply(); i += 1) {
      result = string(abi.encodePacked(result, Strings.toString(wrappedReaper.scythe(i, forStake) / (10 ** DECIMALS)), " "));
    }

    // https://www.rapidtables.com/tools/line-graph.html
    console.log(result);
  }

  function _taxLimits(address wrappedReaperAddress) private {

    WrappedReaper wrappedReaper = WrappedReaper(wrappedReaperAddress);

    uint256 minTax = wrappedReaper.costBasis(PRICE, wrappedReaper.minTaxBasisPoints());
    uint256 maxTax = wrappedReaper.costBasis(PRICE, wrappedReaper.maxTaxBasisPoints());

    /// @dev Blade is inclusive (0 -> bladeWidth) within the linear region.
    ///      The existing supply must be greater than the bladeWidth to activate the blade.
    for (uint i = 0; i < wrappedReaper.maxSupply() - wrappedReaper.bladeWidth(); i += 1)
      assertEq(wrappedReaper.scythe(i, PRICE), PRICE + minTax + i * ((maxTax - minTax) / (wrappedReaper.maxSupply() - wrappedReaper.bladeWidth())));

    /// @dev If there's a blade enabled, poll for the downward trend.
    if (wrappedReaper.bladeWidth() > 0) {

      uint256 finish_blade = wrappedReaper.scythe(((wrappedReaper.maxSupply() - wrappedReaper.bladeWidth()) + 0), PRICE);

      /// @dev bladeWidth can be equal to the maxSupply.
      if (wrappedReaper.maxSupply() > wrappedReaper.bladeWidth()) {
        /// @dev Where we transition from linear growth into the blade, values should be increasing.
        uint256 before_blade = wrappedReaper.scythe(((wrappedReaper.maxSupply() - wrappedReaper.bladeWidth()) - 1), PRICE);
        /// @dev Ensure the point of transition is increasing.
        assertTrue(finish_blade > before_blade);
      }

      /// @dev Ensure decreasing after handle depth; all values from this point should reduce.
      for (uint i = wrappedReaper.maxSupply() - wrappedReaper.bladeWidth() + 1; i < wrappedReaper.maxSupply(); i += 1) {
        uint256 b = wrappedReaper.scythe(i, PRICE);
        assertTrue(b < finish_blade);
        finish_blade = b;
      }
    }

    /// @dev Ensure scythe works within entire bounds (i.e. encounter no numeric faults).
    for (uint i = 0; i < wrappedReaper.maxSupply(); i += 1) {
      assertTrue(wrappedReaper.scythe(i, PRICE) > minTax);
      assertTrue(wrappedReaper.scythe(i, PRICE) <= maxTax + PRICE);
    }
  }

  function testTaxLimits01() public {

    uint256 maxSupply = 1000;

    uint256 minTaxBasisPoints = 100;
    uint256 maxTaxBasisPoints = 1000;

    uint256 bladeWidth = maxSupply / 4;
    uint256 bladeDiscountBasisPoints = (maxTaxBasisPoints - minTaxBasisPoints) / 4;

    _taxLimits(address(new WrappedReaper(address(new REAPERSGAMBIT()), address(new WrappedReaperRenderer()), maxSupply, minTaxBasisPoints, maxTaxBasisPoints, bladeWidth, bladeDiscountBasisPoints)));
  }

  function testTaxLimits02() public {

    uint256 maxSupply = 10000;

    uint256 minTaxBasisPoints = 100;
    uint256 maxTaxBasisPoints = 1000;

    uint256 bladeWidth = maxSupply / 4;
    uint256 bladeDiscountBasisPoints = (maxTaxBasisPoints - minTaxBasisPoints) / 4;

    _taxLimits(address(new WrappedReaper(address(new REAPERSGAMBIT()), address(new WrappedReaperRenderer()), maxSupply, minTaxBasisPoints, maxTaxBasisPoints, bladeWidth, bladeDiscountBasisPoints)));
  }

  function testTaxLimits03() public {
    uint256 maxSupply = 1;

    uint256 minTaxBasisPoints = 100;
    uint256 maxTaxBasisPoints = 1000;

    uint256 bladeWidth = 1;
    uint256 bladeDiscountBasisPoints = (maxTaxBasisPoints - minTaxBasisPoints) / 4;

    WrappedReaper wrappedReaper = new WrappedReaper(address(new REAPERSGAMBIT()), address(new WrappedReaperRenderer()), maxSupply, minTaxBasisPoints, maxTaxBasisPoints, bladeWidth, bladeDiscountBasisPoints);

    _taxLimits(address(wrappedReaper));

    assertEq(wrappedReaper.scythe(0, PRICE), PRICE + wrappedReaper.costBasis(PRICE, wrappedReaper.maxTaxBasisPoints()));
  }

  function testTaxLimits04() public {
    // How many can exist at once.
    uint256 maxSupply = 150;
    // What's the minimum amount of $RG burned.
    uint256 minTaxBasisPoints = 1000;
    // What's the maximum amount of $RG burned.
    uint256 maxTaxBasisPoints = 2500;
    // How far into the distribution does the price start decreasing.
    uint256 bladeWidth = 50;
    // How much the price decreses by.
    uint256 bladeDiscountBasisPoints = (maxTaxBasisPoints - minTaxBasisPoints) / 2;

    WrappedReaper wrappedReaper = new WrappedReaper(address(new REAPERSGAMBIT()), address(new WrappedReaperRenderer()), maxSupply, minTaxBasisPoints, maxTaxBasisPoints, bladeWidth, bladeDiscountBasisPoints);

    _taxLimits(address(wrappedReaper));
  }

  function testCurrentScythe() public {

    uint256 maxSupply = 1000;

    uint256 minTaxBasisPoints = 100;
    uint256 maxTaxBasisPoints = 1000;

    uint256 bladeWidth = maxSupply / 4;
    uint256 bladeDiscountBasisPoints = (maxTaxBasisPoints - minTaxBasisPoints) / 4;

    WrappedReaper wrappedReaper = new WrappedReaper(address(new REAPERSGAMBIT()), address(new WrappedReaperRenderer()), maxSupply, minTaxBasisPoints, maxTaxBasisPoints, bladeWidth, bladeDiscountBasisPoints);

    assertEq(wrappedReaper.currentScythe(PRICE), PRICE + wrappedReaper.costBasis(PRICE, wrappedReaper.minTaxBasisPoints()));

  }

  function testRenderScythe() public {

    uint256 maxSupply = 99;
    uint256 minTax = 900; // 9%
    uint256 maxTax = 3300; // 33%
    uint256 bladeWidth = 40;
    uint256 bladeDiscount = 1200;

    REAPERSGAMBIT reapersGambit = new REAPERSGAMBIT();
    WrappedReaper wrappedReaper = new WrappedReaper(address(reapersGambit), address(new WrappedReaperRenderer()), maxSupply, minTax, maxTax, bladeWidth, bladeDiscount);

    //_renderScythe(address(wrappedReaper), wrappedReaper.minStake());
    //_renderScythe(address(wrappedReaper), wrappedReaper.maxStake());
  }

}
