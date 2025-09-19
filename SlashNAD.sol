// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SlashNAD by Monad
 * @dev This contract manages the NAD token and the game's on-chain logic.
 * Players can say GM on-chain and claim tokens based on their game score.
 */
contract SlashNad is ERC20, Ownable {

    // Mapping to store the high score of each player
    mapping(address => uint256) public highScores;

    // Event to announce when a player says GM
    event GMed(address indexed player, uint256 timestamp);

    // Event to announce when a player claims tokens
    event TokensClaimed(address indexed player, uint256 score, uint256 amount);

    /**
     * @dev Sets the initial owner, and the name and symbol of the ERC20 token.
     */
    constructor(address initialOwner) ERC20("NAD", "NAD") Ownable(initialOwner) {}

    /**
     * @dev Allows a player to send an on-chain "Good Morning" message.
     * This function simply emits an event to log the activity.
     */
    function gm() external {
        emit GMed(msg.sender, block.timestamp);
    }

    /**
     * @dev Allows a player to claim NAD tokens based on their game score.
     * Tokens are minted on a 1:1 ratio with the score (1 score = 1 NAD token).
     * This function also updates the player's high score if the new score is higher.
     * @param _score The score achieved by the player in the game.
     */
    function claimTokens(uint256 _score) external {
        require(_score > 0, "Score must be greater than zero");

        // Update high score if the new score is better
        if (_score > highScores[msg.sender]) {
            highScores[msg.sender] = _score;
        }

        // As per the rule: jitne score utne coins (1:1 ratio)
        // Note: ERC20 tokens have decimals. 1 token is 1 * 10**18.
        uint256 amountToMint = _score * (10**decimals());

        // Mint new tokens and send them to the player
        _mint(msg.sender, amountToMint);

        // Emit an event to log the claim
        emit TokensClaimed(msg.sender, _score, amountToMint);
    }

    /**
     * @dev A function to view a player's current high score.
     * @param _player The address of the player.
     * @return The highest score recorded for the player.
     */
    function getHighScore(address _player) external view returns (uint256) {
        return highScores[_player];
    }
}