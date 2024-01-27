// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../morpho-blue/src/interfaces/IOracle.sol";

contract PPSOracle is Ownable, IOracle {
    event SetPrice(uint256 oldPrice, uint256 newPrice);

    uint256 public _price;

    constructor(address owner) Ownable(owner) {}

    /// @notice Sets the `price` per share with the correct scaling.
    /// @param newPrice The new price, scaled by WAD.
    /// @dev Set the price to 0 to make the oracle revert on `price`.
    function setPrice(uint256 newPrice) public onlyOwner {
        emit SetPrice(_price, newPrice);
        _price = newPrice;
    }

    /// @inheritdoc IOracle
    function price() override external view returns (uint256) {
        require(_price > 0);
        return _price;
    }
}
