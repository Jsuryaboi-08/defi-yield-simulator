import type { ProtocolData } from '../types';

// Mock data to be used when API fails or for development
const MOCK_PROTOCOLS: ProtocolData[] = [
    {
        id: 'aave-v3',
        name: 'Aave V3',
        symbol: 'USDC',
        apy: 4.5,
        tvl: 1500000000,
        riskScore: 2,
        chain: 'Ethereum',
        description: 'Leading decentralized lending protocol allowing users to lend, borrow, and earn interest on crypto assets.',
    },
    {
        id: 'yearn-finance',
        name: 'Yearn Finance',
        symbol: 'USDC',
        apy: 5.2,
        tvl: 400000000,
        riskScore: 4,
        chain: 'Ethereum',
        description: 'Yield aggregator that optimizes DeFi returns by automatically moving funds between protocols.',
    },
    {
        id: 'uniswap-v3',
        name: 'Uniswap V3',
        symbol: 'USDC/ETH',
        apy: 12.5,
        tvl: 800000000,
        riskScore: 7,
        chain: 'Ethereum',
        description: 'Largest decentralized exchange (DEX) utilizing concentrated liquidity for higher capital efficiency.',
    },
    {
        id: 'maker-dao',
        name: 'MakerDAO',
        symbol: 'DAI',
        apy: 3.8,
        tvl: 5000000000,
        riskScore: 1,
        chain: 'Ethereum',
        description: 'Decentralized organization managing the DAI stablecoin, backed by crypto collateral.',
    },
];

export const fetchProtocolData = async (): Promise<ProtocolData[]> => {
    // In a real app, we would fetch from APIs here.
    // For this simulator, we'll simulate a network delay and return mock data.
    // We can expand this to fetch from DeFiLlama if needed.

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_PROTOCOLS);
        }, 1000);
    });
};

export const getProtocolById = async (id: string): Promise<ProtocolData | undefined> => {
    const protocols = await fetchProtocolData();
    return protocols.find((p) => p.id === id);
};
