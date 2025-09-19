// REPLACE with your own Privy App ID from the dashboard
const YOUR_PRIVY_APP_ID = 'cmfqs83ei00ghjp0c6gs8ddtp';
const MONAD_CROSS_APP_ID = 'cmd8euall0037le0my79qpz42';

// Initialize Privy
window.privy('init', {
    appId: YOUR_PRIVY_APP_ID,
    config: {
        loginMethods: ['email', 'google', 'twitter', 'discord', 'apple'],
        embeddedWallets: {
            createOnLogin: 'users-without-wallets',
            noPromptOnSignature: true
        },
        appearance: {
            theme: 'dark',
            accentColor: '#D001FF',
        },
        // Monad Games ID specific configuration
        loginMethodsAndOrder: [{
            id: 'cross_app_account',
            providerApp: {
                id: MONAD_CROSS_APP_ID,
                name: 'Monad Games ID',
                logo: 'https://pbs.twimg.com/profile_images/1792641038563332096/9nGRb22d_400x400.jpg'
            }
        }],
    }
});

// Function to get Monad Games ID wallet and username
export async function getMonadInfo() {
    const user = window.privy.user;
    if (!user) return null;

    // Find the Monad Games ID linked account
    const crossAppAccount = user.linkedAccounts.find(
        account => account.type === "cross_app" && account.providerApp.id === MONAD_CROSS_APP_ID
    );

    if (!crossAppAccount || crossAppAccount.embeddedWallets.length === 0) {
        return { walletAddress: null, username: null };
    }

    // Get the wallet address
    const walletAddress = crossAppAccount.embeddedWallets[0].address;

    // Fetch the username from the API
    try {
        const response = await fetch(`https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${walletAddress}`);
        const data = await response.json();
        const username = data.hasUsername ? data.user.username : 'Unnamed Player';
        return { walletAddress, username };
    } catch (error) {
        console.error("Failed to fetch username:", error);
        return { walletAddress, username: 'Player' };
    }
}

// Function to handle login
export function loginWithPrivy() {
    window.privy('login');
}

// Function to handle logout
export function logoutWithPrivy() {
    window.privy('logout');
}
