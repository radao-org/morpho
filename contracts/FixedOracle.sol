// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../morpho-blue/src/interfaces/IOracle.sol";

contract FixedOracle is Ownable, IOracle {
    uint256 public _price;

    constructor(address owner) Ownable(owner) {}

    /// @notice Sets the `price` with the correct scaling.
    /// @param newPrice The new price, scaled by WAD.
    /// @dev Set the price to 0 to make the oracle revert on `price`.
    function setPrice(uint256 newPrice) public onlyOwner {
        _price = newPrice;
    }

    /// @inheritdoc IOracle
    function price() override external view returns (uint256) {
        require(_price > 0);
        return _price;
    }
}
