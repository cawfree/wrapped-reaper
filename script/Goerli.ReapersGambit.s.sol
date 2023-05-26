// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Script.sol";

import {REAPERSGAMBIT} from "../src/ReapersGambit.sol";
import {WrappedReaper} from "../src/WrappedReaper.sol";

contract GoerliReapersGambit is Script {

  function run() public {

    vm.startBroadcast();

    REAPERSGAMBIT reapersGambit = new REAPERSGAMBIT();

    vm.stopBroadcast();

  }

}
