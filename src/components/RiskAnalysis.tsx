import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { riskEngine } from '../services/risk/engine';
import type { RiskReport } from '../services/risk/types';

interface RiskAnalysisProps {
    protocolId: string;
}

export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ protocolId }) => {
    const [report, setReport] = useState<RiskReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRisk = async () => {
            setLoading(true);
            try {
                const data = await riskEngine.getRiskReport(protocolId);
                setReport(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRisk();
    }, [protocolId]);

    if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Analyzing protocol risks...</div>;
    if (!report) return <div className="p-8 text-center text-red-500">Failed to load risk data.</div>;

    const chartData = [
        { subject: 'Smart Contract', A: report.breakdown.smartContract, fullMark: 20 },
        { subject: 'Market', A: report.breakdown.market, fullMark: 20 },
        { subject: 'Liquidity', A: report.breakdown.liquidity, fullMark: 20 },
        { subject: 'Protocol', A: report.breakdown.protocolSpecific, fullMark: 20 },
        { subject: 'Governance', A: report.breakdown.governance, fullMark: 20 },
    ];

    const getRiskColor = (score: number) => {
        if (score >= 16) return 'text-green-400';
        if (score >= 10) return 'text-yellow-400';
        return 'text-red-400';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white">Risk Profile</h3>
                        <p className="text-sm text-muted-foreground">Comprehensive security assessment</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${report.riskLevel === 'Low' ? 'bg-green-500/20 border-green-500/50 text-green-400' :
                        report.riskLevel === 'Medium' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' :
                            'bg-red-500/20 border-red-500/50 text-red-400'
                        }`}>
                        {report.riskLevel} Risk ({report.totalScore}/100)
                    </div>
                </div>

                <div className="flex-1 min-h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 20]} tick={false} axisLine={false} />
                            <Radar
                                name={protocolId}
                                dataKey="A"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                fill="#8b5cf6"
                                fillOpacity={0.3}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#8b5cf6' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {Object.entries(report.categories).map(([key, category]) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card/30 border border-white/5 rounded-xl p-4 hover:bg-card/50 transition-colors"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                                {category.score >= 16 ? <CheckCircle size={16} className="text-green-400 mr-2" /> :
                                    category.score >= 10 ? <Info size={16} className="text-yellow-400 mr-2" /> :
                                        <AlertTriangle size={16} className="text-red-400 mr-2" />}
                                <h4 className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                            </div>
                            <span className={`text-sm font-bold ${getRiskColor(category.score)}`}>{category.score.toFixed(1)}/20</span>
                        </div>

                        <div className="w-full bg-white/5 rounded-full h-1.5 mb-3">
                            <div
                                className={`h-1.5 rounded-full ${category.score >= 16 ? 'bg-green-500' :
                                    category.score >= 10 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${(category.score / 20) * 100}%` }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
                            {Object.entries(category.details).map(([detailKey, value]) => (
                                <div key={detailKey} className="flex justify-between items-center border-b border-white/5 pb-1 last:border-0">
                                    <span className="capitalize opacity-70">{detailKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span className="text-white font-mono">
                                        {typeof value === 'number' ? (value < 1 && value > 0 ? value.toFixed(4) : value.toLocaleString()) : value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
