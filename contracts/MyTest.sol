// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "../node_modules/hardhat/console.sol";

contract MyTest {
    uint256 public unlockedTime;
    address payable public owner;
    event Withdrawal(uint256 amount, uint256 when);

    constructor(uint256 _unlockedTime) payable {
        require(
            block.timestamp < _unlockedTime,
            "UnlockedTime should be of the future"
        );
        unlockedTime = _unlockedTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // this function will withdraw funds for the owner
        require(msg.sender == owner, "You can't withdraw");
        require(
            block.timestamp >= unlockedTime,
            "Wait till time period to complete"
        );
        emit Withdrawal(address(this).balance, block.timestamp);
        owner.transfer(address(this).balance);
    }
}
