// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ComedyClash {
    address public manager;
    bool public closed = false;
    string public description;
    uint public completionTimestamp;

    struct Submission {
        address artist;
        string name;
        string topic;
        string preview;
        mapping(address => Voting) voters;
        Voting[] votes;
        uint averageTotal;
        uint averageCount;
    }

    struct Voting {
        string voter;
        string comment;
        uint8 value; // out of [1..5]
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Not the owner");
        _;
    }
    constructor(string memory _description, uint _durationInDays) {
        manager = msg.sender;
        description = _description;
        completionTimestamp = block.timestamp + _durationInDays * 1 days;
    }

    
}
