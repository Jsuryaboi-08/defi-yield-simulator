import type { SimulationResult } from '../types';

/**
 * Calculates the projected yield over a period of time using compound interest.
 * Formula: A = P(1 + r/n)^(nt)
 * For simplicity, we assume monthly compounding (n=12).
 * 
 * @param principal Initial investment amount
 * @param apy Annual Percentage Yield (as a percentage, e.g., 5.5 for 5.5%)
 * @param months Duration in months
 * @returns Array of SimulationResult for each month
 */
export const calculateProjectedYield = (
    principal: number,
    apy: number,
    months: number
): SimulationResult[] => {
    const results: SimulationResult[] = [];
    const rate = apy / 100;
    const n = 12; // Monthly compounding

    for (let i = 0; i <= months; i++) {
        const t = i / 12; // Time in years
        const amount = principal * Math.pow(1 + rate / n, n * t);

        results.push({
            month: i,
            value: Number(amount.toFixed(2)),
            yieldEarned: Number((amount - principal).toFixed(2)),
        });
    }

    return results;
};

/**
 * Calculates a risk score based on volatility and TVL.
 * This is a simplified heuristic for the simulator.
 * 
 * @param volatility Volatility index (0-1)
 * @param tvl Total Value Locked
 * @returns Risk score from 1-10
 */
export const calculateRiskScore = (volatility: number, tvl: number): number => {
    // Higher TVL generally means lower risk (inverse relationship)
    // Higher volatility means higher risk

    const tvlScore = Math.max(1, 10 - Math.log10(tvl / 1000000)); // Simplified log scale
    const volScore = volatility * 10;

    const score = (tvlScore + volScore) / 2;
    return Math.min(10, Math.max(1, Math.round(score)));
};

export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};
