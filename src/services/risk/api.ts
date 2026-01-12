import type { MarketData, TvlData, GraphData } from './types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const DEFILLAMA_API = 'https://api.llama.fi';
// const THE_GRAPH_API = 'https://api.thegraph.com/subgraphs/name';

// Cache to avoid hitting rate limits
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key: string) => {
    const cached = cache[key];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};

const setCachedData = (key: string, data: any) => {
    cache[key] = { data, timestamp: Date.now() };
};

export const fetchDefiLlamaData = async (protocolSlug: string): Promise<TvlData> => {
    const cacheKey = `defillama-${protocolSlug}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
        const response = await fetch(`${DEFILLAMA_API}/protocol/${protocolSlug}`);
        if (!response.ok) throw new Error('Failed to fetch TVL data');
        const data = await response.json();

        // Calculate 30d volatility from TVL history
        const tvlHistory = data.tvl || [];
        const last30Days = tvlHistory.slice(-30);
        let volatility30d = 0.05; // Default

        if (last30Days.length > 1) {
            const changes = last30Days.map((item: any, i: number) => {
                if (i === 0) return 0;
                return (item.totalLiquidityUSD - last30Days[i - 1].totalLiquidityUSD) / last30Days[i - 1].totalLiquidityUSD;
            }).slice(1);

            const mean = changes.reduce((a: number, b: number) => a + b, 0) / changes.length;
            const variance = changes.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / changes.length;
            volatility30d = Math.sqrt(variance);
        }

        const tvlData: TvlData = {
            total: data.tvl[data.tvl.length - 1]?.totalLiquidityUSD || 0,
            volatility30d,
            chains: data.chains ? Object.fromEntries(data.chains.map((c: string) => [c, 0])) : {},
        };

        setCachedData(cacheKey, tvlData);
        return tvlData;
    } catch (error) {
        console.error('DefiLlama API Error:', error);
        return {
            total: 1000000000,
            volatility30d: 0.05,
            chains: { Ethereum: 1000000000 },
        };
    }
};

export const fetchCoinGeckoData = async (coinId: string): Promise<MarketData> => {
    const cacheKey = `coingecko-${coinId}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
        const response = await fetch(
            `${COINGECKO_API}/simple/price?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
        );

        if (!response.ok) throw new Error('Failed to fetch market data');
        const data = await response.json();
        const coin = data[coinId];

        if (!coin) throw new Error('Coin data not found');

        const marketData: MarketData = {
            price: coin.usd,
            marketCap: coin.usd_market_cap,
            volume24h: coin.usd_24h_vol,
            volatility30d: Math.abs(coin.usd_24h_change / 100) * 5, // Approximation
            volatility90d: Math.abs(coin.usd_24h_change / 100) * 6, // Approximation
        };

        setCachedData(cacheKey, marketData);
        return marketData;
    } catch (error) {
        console.error('CoinGecko API Error:', error);
        return {
            price: 1,
            marketCap: 1000000000,
            volume24h: 50000000,
            volatility30d: 0.04,
            volatility90d: 0.06,
        };
    }
};

export const fetchGraphData = async (protocol: string): Promise<GraphData> => {
    const cacheKey = `graph-${protocol}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    // In a real implementation, we would query specific subgraphs here.
    // For this demo, we will simulate the data structure returned by The Graph.
    // This is because public subgraphs often require specific queries and error handling 
    // that is too complex for a single file without a GraphQL client.

    let data: GraphData = {
        utilizationRate: 0.75,
        healthFactor: 1.5,
        proposalCount: 120,
        borrowRate: 0.03,
        supplyRate: 0.02,
        poolLiquidity: 500000000,
        volumeUSD: 100000000,
        feesUSD: 300000,
    };

    if (protocol === 'aave-v3') {
        data = { ...data, utilizationRate: 0.82, healthFactor: 1.65 };
    } else if (protocol === 'uniswap-v3') {
        data = { ...data, poolLiquidity: 1200000000, volumeUSD: 400000000 };
    }

    setCachedData(cacheKey, data);
    return data;
};
