import type { RiskCategory, MarketData, TvlData, GraphData } from './types';

// Helper to normalize score to 0-20 range
const normalize = (value: number, min: number, max: number): number => {
    return Math.min(20, Math.max(0, ((value - min) / (max - min)) * 20));
};

// A. Smart Contract Risk (0-20 pts)
export const calculateSmartContractRisk = (protocol: string): RiskCategory => {
    let score = 18; // Default high baseline
    const details: Record<string, any> = {
        auditCount: 5,
        daysSinceLastAudit: 120,
        exploitCount: 0,
        bugBountySize: '1M+',
        contractAge: '2+ Years'
    };

    if (protocol === 'uniswap-v3') {
        score = 19.5;
        details.auditCount = 8;
        details.contractAge = '4+ Years';
    } else if (protocol === 'yearn-finance') {
        score = 16; // Higher complexity
        details.complexity = 'High';
    } else if (protocol === 'maker-dao') {
        score = 19;
        details.contractAge = '5+ Years';
    }

    return { score, details };
};

// B. Market Risk (0-20 pts)
export const calculateMarketRisk = (marketData: MarketData): RiskCategory => {
    // Volatility Impact: Higher vol -> Lower score
    // 0% vol -> 20 pts
    // 10% vol -> 0 pts
    const volScore = Math.max(0, 20 - (marketData.volatility30d * 200));

    // Oracle Reliability (Mocked for now, usually high for top protocols)
    const oracleScore = 18;

    const score = (volScore * 0.6) + (oracleScore * 0.4);

    return {
        score,
        details: {
            volatility30d: marketData.volatility30d,
            volatility90d: marketData.volatility90d,
            oracleReliability: 'High',
            priceShockRisk: 'Low',
        },
    };
};

// C. Liquidity Risk (0-20 pts)
export const calculateLiquidityRisk = (tvlData: TvlData, graphData: GraphData): RiskCategory => {
    // TVL Score: > $5B -> 20 pts, < $100M -> 5 pts
    const tvlScore = normalize(tvlData.total, 100000000, 5000000000);

    // Utilization Score (for lending protocols)
    let utilScore = 20;
    if (graphData.utilizationRate) {
        // Optimal utilization is around 80%. Too high (>90%) is risky.
        if (graphData.utilizationRate > 0.9) utilScore = 10;
        else if (graphData.utilizationRate > 0.8) utilScore = 18;
    }

    const score = (tvlScore * 0.7) + (utilScore * 0.3);

    return {
        score,
        details: {
            tvl: tvlData.total,
            tvlVolatility: tvlData.volatility30d,
            utilizationRate: graphData.utilizationRate,
            poolDepth: 'High',
        },
    };
};

// D. Protocol-Specific Risk (0-20 pts)
export const calculateProtocolSpecificRisk = (protocol: string, graphData: GraphData): RiskCategory => {
    let score = 15;
    const details: Record<string, any> = {};

    if (protocol.includes('aave')) {
        // Aave: Health Factor & Collateral Correlation
        const hf = graphData.healthFactor || 1.5;
        score = hf > 1.5 ? 19 : hf > 1.1 ? 14 : 5;
        details.healthFactor = hf;
        details.liquidationRisk = hf < 1.1 ? 'High' : 'Low';
    } else if (protocol.includes('uniswap')) {
        // Uniswap: IL Risk & Volume/Liquidity
        const volLiqRatio = (graphData.volumeUSD || 0) / (graphData.poolLiquidity || 1);
        score = volLiqRatio > 0.5 ? 18 : 15; // High volume is good for LPs (fees) but implies volatility
        details.impermanentLossRisk = 'Medium';
        details.volumeToLiquidity = volLiqRatio;
    } else if (protocol.includes('yearn')) {
        // Yearn: Strategy Risk
        score = 16;
        details.strategyComplexity = 'High';
        details.auditCoverage = '95%';
    } else if (protocol.includes('maker')) {
        // Maker: Peg Stability
        score = 19;
        details.pegDeviation = '0.1%';
        details.surplusBuffer = 'Healthy';
    }

    return { score, details };
};

// E. Governance/Operational Risk (0-20 pts)
export const calculateGovernanceRisk = (protocol: string): RiskCategory => {
    let score = 17;
    const details: Record<string, any> = {
        adminKey: 'Timelock',
        multisigThreshold: '5/9',
        updateFrequency: 'Monthly',
    };

    if (protocol === 'maker-dao') {
        score = 19; // Highly decentralized
        details.governanceModel = 'DAO';
    } else if (protocol === 'uniswap-v3') {
        score = 18; // Immutable core
        details.adminControl = 'Minimal';
    }

    return { score, details };
};
