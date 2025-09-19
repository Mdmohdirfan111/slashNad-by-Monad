import { getMonadInfo } from './auth.js';

const MONAD_TESTNET_CHAIN_ID = 10143;
const GAME_CONTRACT_ADDRESS = "0x476a7659EF796dE2fd1DD18AD7fe20E7C29942F7";
const GAME_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_score","type":"uint256"}],"name":"claimTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"initialOwner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[],"name":"gm","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GMed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"score","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensClaimed","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_player","type":"address"}],"name":"getHighScore","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"highScores","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
const LEADERBOARD_CONTRACT_ADDRESS = "0xceCBFF203C8B6044F52CE23D914A1bfD997541A4";
const LEADERBOARD_CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_game","type":"address"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_image","type":"string"},{"internalType":"string","name":"_url","type":"string"}],"name":"registerGame","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_player","type":"address"},{"internalType":"uint256","name":"_scoreAmount","type":"uint256"},{"internalType":"uint256","name":"_transactionAmount","type":"uint256"}],"name":"updatePlayerData","outputs":[],"stateMutability":"nonpayable","type":"function"}];

export let provider, signer, gameContract, leaderboardContract, userWalletAddress;

export async function setupEthers() {
    if (!window.privy.user) return;
    const privyProvider = await window.privy.getEthersProvider();
    if (!privyProvider) { console.error("Privy provider not available"); return; }
    
    const {chainId} = await privyProvider.getNetwork();
    if (chainId !== MONAD_TESTNET_CHAIN_ID) {
        await window.privy.switchChain(MONAD_TESTNET_CHAIN_ID);
    }
    
    provider = privyProvider;
    signer = await provider.getSigner();
    gameContract = new ethers.Contract(GAME_CONTRACT_ADDRESS, GAME_CONTRACT_ABI, signer);
    leaderboardContract = new ethers.Contract(LEADERBOARD_CONTRACT_ADDRESS, LEADERBOARD_CONTRACT_ABI, signer);
    
    const info = await getMonadInfo();
    userWalletAddress = info.walletAddress;
}

export async function updateNadBalance(balanceEl) {
    if (!gameContract || !userWalletAddress) return;
    try {
        const balance = await gameContract.balanceOf(userWalletAddress);
        const formattedBalance = ethers.formatUnits(balance, 18);
        balanceEl.textContent = `Balance: ${parseFloat(formattedBalance).toFixed(2)} $NAD`;
    } catch (error) { console.error("Could not fetch balance:", error); }
}

export async function submitScoreToLeaderboard(score) {
    if (!leaderboardContract || !userWalletAddress) return;
    console.log(`Submitting score ${score} for ${userWalletAddress}`);
    try {
        const tx = await leaderboardContract.updatePlayerData(userWalletAddress, score, 1);
        await tx.wait();
        console.log("Score submitted successfully to leaderboard contract!");
    } catch (error) { console.error("Failed to submit score to leaderboard:", error); }
}
