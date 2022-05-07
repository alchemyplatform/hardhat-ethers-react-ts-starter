//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Tournament {
    struct Player {
        address wallet;
        // Unique identification for game
        string gameId;
    }

    // TODO: change to private w/ getters
    uint256 private minTeamSize;
    uint256 private maxTeamSize; 
    uint256 private teamLimit;
    uint256 private teamCount = 0;
    mapping(string => Player[]) public teams; 
    
    constructor(uint256 _minTeamSize, uint256 _maxTeamSize, uint256 _teamLimit) {
        require(_minTeamSize <= _maxTeamSize, "Invalid team sizes");
        minTeamSize = _minTeamSize;
        maxTeamSize = _maxTeamSize;
        teamLimit = _teamLimit;
    }

    // Adds team to tournament
    function register(string memory _teamName, Player[] memory _players) public {
        // require(teamCount < teamLimit, "Tourament is full");
        // require(_players.length <= maxTeamSize, "Team has too many players");
        // require(_players.length >= minTeamSize, "Team has too little players");
        for (uint i = 0; i < _players.length; i += 1) {
            teams[_teamName].push(_players[i]);
        }
        teamCount += 1;
    }

    // Removes team from tournament
    function unregister() public {}

    // Confirm registered teams are correct, and commences tournament
    function confirm() public {
        createGameContracts();
    }

    // Create contracts to track each game in the tournament
    function createGameContracts() private {}

    // Complete and calculates tournament
    function complete() public {}

    function getTeamCount() public view returns(uint256) {
        return teamCount;
    }
}