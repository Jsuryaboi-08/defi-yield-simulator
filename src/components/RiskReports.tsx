import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';
import { riskEngine } from '../services/risk/engine';
import type { RiskReport } from '../services/risk/types';
import { RiskAnalysis } from './RiskAnalysis';

const PROTOCOLS = ['aave-v3', 'uniswap-v3', 'yearn-finance', 'maker-dao'];

export const RiskReports: React.FC = () => {
    const [reports, setReports] = useState<RiskReport[]>([]);
    const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReports = async () => {
            setLoading(true);
            try {
                const data = await Promise.all(PROTOCOLS.map(p => riskEngine.getRiskReport(p)));
                setReports(data);
            } catch (error) {
                console.error("Failed to load risk reports", error);
            } finally {
                setLoading(false);
            }
        };
        loadReports();
    }, []);

    if (selectedProtocol) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setSelectedProtocol(null)}
                    className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    <ChevronRight className="rotate-180 mr-1" size={16} />
                    Back to Reports
                </button>
                <RiskAnalysis protocolId={selectedProtocol} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                    Risk Reports
                </h2>
                <p className="text-muted-foreground">Deep dive into protocol security and risk metrics.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reports.map((report, index) => (
                        <motion.div
                            key={report.protocolId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedProtocol(report.protocolId)}
                            className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-card/50 transition-all hover:scale-[1.02] group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-xl mr-4 ${report.riskLevel === 'Low' ? 'bg-green-500/10 text-green-400' :
                                        report.riskLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-red-500/10 text-red-400'
                                        }`}>
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold capitalize text-white group-hover:text-primary transition-colors">
                                            {report.protocolId.replace('-', ' ')}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {report.riskLevel} Risk
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-white">{report.totalScore}</span>
                                    <span className="text-xs text-muted-foreground block">/ 100</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Smart Contract</span>
                                    <span className={report.breakdown.smartContract >= 15 ? 'text-green-400' : 'text-yellow-400'}>
                                        {report.breakdown.smartContract}
                                    </span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-1">
                                    <div
                                        className="bg-primary h-1 rounded-full opacity-50"
                                        style={{ width: `${report.breakdown.smartContract / 20 * 100}%` }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
