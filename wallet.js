// MONAD Contract Configuration
const contractAddress = "0x476a7659EF796dE2fd1DD18AD7fe20E7C29942F7";
const contractABI = [{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_score","type":"uint256"}],"name":"claimTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"initialOwner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[],"name":"gm","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"GMed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"score","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensClaimed","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_player","type":"address"}],"name":"getHighScore","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"highScores","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

// MONAD Network Configuration
const monadNetwork = { 
    chainId: '0x279F', // 10143 in hexadecimal
    chainName: 'Monad Testnet', 
    nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 }, 
    rpcUrls: ['https://testnet-rpc.monad.xyz'], 
    blockExplorerUrls: ['https://testnet.monadexplorer.com'] 
};

// Global Web3 Variables that we will share with script.js
export let provider, signer, contract, userAccount;

async function switchNetwork() {
    try {
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: monadNetwork.chainId }] });
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [monadNetwork],
                });
            } catch (addError) {
                console.error("Failed to add Monad network:", addError);
            }
        }
    }
}

export async function connectWallet(onConnectedCallback) {
    if (typeof window.ethereum === 'undefined') {
        return alert('Please install MetaMask to play!');
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];

        provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        if (network.chainId !== BigInt(monadNetwork.chainId)) {
            await switchNetwork();
        }
        
        signer = await provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Notify script.js that the connection was successful
        onConnectedCallback();
    } catch (error) {
        console.error("Error connecting wallet:", error);
        alert('Failed to connect wallet. Please check the console for details.');
    }
}

// NAME CHANGE: Renamed function for clarity
export async function updateNadBalance(wokeBalanceEl) {
    if (!contract || !userAccount) return;
    try {
        const balance = await contract.balanceOf(userAccount);
        const formattedBalance = ethers.formatUnits(balance, 18);
        // SYMBOL CHANGE: Updated to $NAD
        wokeBalanceEl.textContent = `Balance: ${parseFloat(formattedBalance).toFixed(2)} $NAD`;
    } catch (error) {
        console.error("Could not fetch balance:", error);
        wokeBalanceEl.textContent = "Balance: Error";
    }
}

export async function getOnChainHighScore() {
    if (!contract || !userAccount) return 0;
    try {
        const onChainHighScore = await contract.getHighScore(userAccount);
        return Number(onChainHighScore);
    } catch (error) {
        console.error("Could not fetch high score:", error);
        return 0; // Return 0 if there's an error
    }
}

export async function handleGm(gmBtn) {
    if (!contract) {
        return alert("Please connect your wallet first.");
    }

    gmBtn.disabled = true;
    gmBtn.textContent = 'Sending...';
    try {
        const tx = await contract.gm();
        await tx.wait();
        alert("Success! GM sent on-chain.");
    } catch (error) {
        console.error("GM transaction failed:", error);
        alert("GM transaction failed.");
    } finally {
        gmBtn.disabled = false;
        gmBtn.textContent = 'GM On-chain';
    }
}

// NEW FEATURE: Disconnect Wallet Logic
export function disconnectWallet() {
    // This is a simple implementation. For a full disconnect, dApp needs to "forget" the provider.
    // For now, we can just clear our variables. A page refresh is often the cleanest way.
    provider = null;
    signer = null;
    contract = null;
    userAccount = null;
    console.log("Disconnected");
    // Reload the page to reset the state completely
    window.location.reload();
}
