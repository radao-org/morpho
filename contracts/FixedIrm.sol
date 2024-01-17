// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../morpho-blue/src/interfaces/IIrm.sol";

contract FixedIrm is IIrm {
    uint public constant ONE_YEAR_IN_SECONDS = (36525 * 24 * 60 * 60) / 100;
    uint256 immutable public apr;
    uint256 immutable public ratePerSec;

    /// @param _apr The target annual percentage rate, scaled by 1e18. Example: 80000000000000000 for 8% APR.
    /// @dev Warning: Borrowed rate (per second) is an approximate value which leads to an APR slightly below the target.
    /// For example, a 8% APR param builds a ratePerSec of 2535047025 that in-fine corresponds to a 7.999999999614% APR.
    constructor(uint256 _apr) {
        apr = _apr;
        ratePerSec = _apr / ONE_YEAR_IN_SECONDS;
    }

    /// @inheritdoc IIrm
    function borrowRate(MarketParams memory, Market memory) external view returns (uint256) {
        return ratePerSec;
    }

    /// @inheritdoc IIrm
    function borrowRateView(MarketParams memory, Market memory) external view returns (uint256) {
        return ratePerSec;
    }
}
