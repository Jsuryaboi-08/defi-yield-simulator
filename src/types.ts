export interface ProtocolData {
    id: string;
    name: string;
    symbol: string;
    apy: number;
    tvl: number;
    riskScore: number; // 0-10, lower is safer
    logoUrl?: string;
    chain: string;
}

export interface SimulationResult {
    month: number;
    value: number;
    yieldEarned: number;
}

export interface SimulationParams {
    principal: number;
    durationMonths: number;
    selectedProtocolId: string;
}
