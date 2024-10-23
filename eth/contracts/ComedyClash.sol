// SPDX-License-Identifier: MIT
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

    uint public constant PRECISION = 1e18; // 18 decimal places

    // keep track of voters for a certain submission (index)
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
        uint averageValue; // gets computed on every new vote
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

    // The owner/creater will be the factory, the manager the actual person running the theater
    constructor(
        address _manager,
        string memory _description,
        uint _durationInDays
    ) {
        manager = _manager;
        description = _description;
        completionTimestamp = block.timestamp + _durationInDays * 1 days;
    }

    function closeSubmission() public onlyManager {
        closed = true;
    }

    // Creates a new submission for the comdedy show
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

    // Creates a Voting for the submission at given index
    function createVotingForSubmission(
        uint index,
        string memory _voter,
        string memory _comment,
        uint8 _value
    ) public openForSubmission {
        Submission storage submission = submissions[index];
        // no voting from the creator of the submission
        require(submission.artist != msg.sender);
        // exclude multiple votings of the same address on the same submission
        require(!submissionVoters[index][msg.sender]);

        Voting memory voting = Voting({
            voter: _voter,
            comment: _comment,
            value: _value
        });

        submission.votes.push(voting);
        submissionVoters[index][msg.sender] = true;

        // compute the average vote for the submission
        submission.averageTotal += _value;
        submission.averageCount++;
        submission.averageValue =
            (submission.averageTotal * PRECISION) /
            submission.averageCount;
    }

    // Retrieves the vote at given index for a submission at given index
    function getVoteForSubmission(
        uint indexSubmission,
        uint indexVote
    ) public view returns (Voting memory) {
        return submissions[indexSubmission].votes[indexVote];
    }
}
