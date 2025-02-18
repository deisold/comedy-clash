// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./ComedyClash.sol";

// The ComedyTheater manages comedy shows being performed on its stage
/* 
    V.1.0.1:    - Added event ShowCreated
*/
contract ComedyTheater {
    address public manager;

    ComedyClash[] public shows;
    // uint public showCount;

    modifier onlyManager() {
        require(msg.sender == manager, "Not the manager");
        _;
    }

    event ShowCreated(address indexed showAddress);

    constructor() {
        manager = msg.sender;
    }

    function addShow(
        string memory _description,
        uint _durationInDays
    ) public onlyManager {
        ComedyClash newShow = new ComedyClash(
            manager,
            _description,
            _durationInDays
        );

        shows.push(newShow);
        //
        emit ShowCreated(address(newShow));
    }

    function getShowAmount() public view returns (uint) {
        return shows.length;
    }
}
