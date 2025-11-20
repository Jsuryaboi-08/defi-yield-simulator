import { fetchDefiLlamaData, fetchCoinGeckoData, fetchGraphData } from './api';
import {
    calculateSmartContractRisk,
    calculateMarketRisk,
    calculateLiquidityRisk,
    calculateProtocolSpecificRisk,
    calculateGovernanceRisk,
} from './calculators';
import type { RiskReport, RiskLevel } from './types';

const PROTOCOL_MAPPING: Record<string, { llama: string; gecko: string }> = {
    'aave-v3': { llama: 'aave-v3', gecko: 'aave' },
    'yearn-finance': { llama: 'yearn-finance', gecko: 'yearn-finance' },
    'uniswap-v3': { llama: 'uniswap-v3', gecko: 'uniswap' },
    'maker-dao': { llama: 'makerdao', gecko: 'maker' },
};

export class RiskEngine {
    async getRiskReport(protocolId: string): Promise<RiskReport> {
        const mapping = PROTOCOL_MAPPING[protocolId];
        if (!mapping) {
            throw new Error(`Unknown protocol: ${protocolId}`);
        }

        // Parallel data fetching
        const [tvlData, marketData, graphData] = await Promise.all([
            fetchDefiLlamaData(mapping.llama),
            fetchCoinGeckoData(mapping.gecko),
            fetchGraphData(protocolId),
        ]);

        // Calculate scores
        const smartContract = calculateSmartContractRisk(protocolId);
        const market = calculateMarketRisk(marketData);
        const liquidity = calculateLiquidityRisk(tvlData, graphData);
        const protocolSpecific = calculateProtocolSpecificRisk(protocolId, graphData);
        const governance = calculateGovernanceRisk(protocolId);

        // Aggregate total score (Weighted Average: 0.2 each)
        const totalScore =
            0.2 * smartContract.score +
            0.2 * market.score +
            0.2 * liquidity.score +
            0.2 * protocolSpecific.score +
            0.2 * governance.score;

        // Scale to 0-100 (Since each category is 0-20, sum is 0-100, but weighted sum is 0-20. 
        // Wait, user asked for "Total score (0-100)".
        // Formula: 0.2 * (SC + M + L + P + G) where each is 0-20.
        // If all are 20, result is 0.2 * 100 = 20.
        // User likely meant sum of unweighted, OR weighted sum scaled.
        // "risk_score = 0.20*SmartContract + ... + 0.20*Governance"
        // If inputs are 0-20, max result is 20.
        // But "Return: Total score (0-100)".
        // I will assume inputs should be scaled to 0-100 internally OR result multiplied by 5.
        // Let's multiply the final weighted sum by 5 to get 0-100 range.

        const finalScore = totalScore * 5;

        // Determine risk level
        let riskLevel: RiskLevel = 'Low';
        if (finalScore < 40) riskLevel = 'Critical';
        else if (finalScore < 60) riskLevel = 'High';
        else if (finalScore < 80) riskLevel = 'Medium';

        return {
            protocolId,
            totalScore: Number(finalScore.toFixed(1)),
            riskLevel,
            breakdown: {
                smartContract: Number(smartContract.score.toFixed(1)),
                market: Number(market.score.toFixed(1)),
                liquidity: Number(liquidity.score.toFixed(1)),
                protocolSpecific: Number(protocolSpecific.score.toFixed(1)),
                governance: Number(governance.score.toFixed(1)),
            },
            categories: {
                smartContract,
                market,
                liquidity,
                protocolSpecific,
                governance,
            },
            timestamp: Date.now(),
        };
    }
}

export const riskEngine = new RiskEngine();
