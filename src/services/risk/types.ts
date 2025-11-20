export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface RiskCategory {
    score: number; // 0-20
    details: Record<string, any>;
}

export interface RiskScoreBreakdown {
    smartContract: number;
    market: number;
    liquidity: number;
    protocolSpecific: number;
    governance: number;
}

export interface RiskReport {
    protocolId: string;
    totalScore: number; // 0-100
    riskLevel: RiskLevel;
    breakdown: RiskScoreBreakdown;
    categories: {
        smartContract: RiskCategory;
        market: RiskCategory;
        liquidity: RiskCategory;
        protocolSpecific: RiskCategory;
        governance: RiskCategory;
    };
    timestamp: number;
}

export interface MarketData {
    price: number;
    marketCap: number;
    volume24h: number;
    volatility30d: number; // Standard deviation of daily returns
    volatility90d: number;
}

export interface TvlData {
    total: number;
    volatility30d: number;
    chains: Record<string, number>;
}

export interface GraphData {
    utilizationRate?: number;
    healthFactor?: number;
    proposalCount?: number;
    borrowRate?: number;
    supplyRate?: number;
    poolLiquidity?: number;
    volumeUSD?: number;
    feesUSD?: number;
}
