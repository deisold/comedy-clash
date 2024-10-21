// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ComedyClash {
    address public manager;
    bool public closed = false;
    string public description;
    uint public completionTimestamp;

    Submission[] public submissions;
    uint public submissionCount;

    // keep track of voters for a certain submission
    mapping(uint => mapping(address => bool)) public submissionVoters;

    struct Submission {
        uint id;
        address artist;
        string name;
        string topic;
        string preview;
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
        require(msg.sender == manager, "Not the manager");
        _;
    }

    modifier openForSubmission() {
        require(!closed);
        require(completionTimestamp > block.timestamp);
        _;
    }

    constructor(string memory _description, uint _durationInDays) {
        manager = msg.sender;
        description = _description;
        completionTimestamp = block.timestamp + _durationInDays * 1 days;
    }

    function closeSubmissions() public onlyManager openForSubmission {
        closed = true;
    }

    function createSubmissions(
        string memory _name,
        string memory _topic,
        string memory _preview
    ) public openForSubmission {
        submissions.push();
        submissionCount++;

        Submission storage newSubmission = submissions[submissionCount - 1];

        newSubmission.id = submissionCount;
        newSubmission.artist = msg.sender;
        newSubmission.name = _name;
        newSubmission.topic = _topic;
        newSubmission.preview = _preview;
    }
}
