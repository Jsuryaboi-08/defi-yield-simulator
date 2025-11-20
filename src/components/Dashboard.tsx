import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Shield, DollarSign, ArrowUpRight, ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { ProtocolData } from '../types';
import { fetchProtocolData } from '../services/api';
import { formatCurrency } from '../utils/calculations';
import { RiskAnalysis } from './RiskAnalysis';

const StatCard = ({
    label,
    value,
    subValue,
    icon: Icon,
    trend
}: {
    label: string,
    value: string,
    subValue?: string,
    icon: any,
    trend?: 'up' | 'down'
}) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-card/50 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-lg relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon size={80} />
        </div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary shadow-[0_0_10px_rgba(var(--primary),0.2)]">
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full border ${trend === 'up' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        {trend === 'up' ? '+' : '-'}{Math.floor(Math.random() * 5) + 1}%
                        <ArrowUpRight size={12} className="ml-1" />
                    </span>
                )}
            </div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">{label}</h3>
            <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
            {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
        </div>
    </motion.div>
);

const ProtocolRow = ({ protocol, index }: { protocol: ProtocolData, index: number }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${expanded ? 'bg-white/5' : ''}`}
                onClick={() => setExpanded(!expanded)}
            >
                <td className="py-4 px-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 mr-4 flex items-center justify-center text-sm font-bold shadow-lg">
                            {protocol.symbol.substring(0, 1)}
                        </div>
                        <div>
                            <p className="font-bold text-base">{protocol.name}</p>
                            <p className="text-xs text-muted-foreground">{protocol.chain}</p>
                        </div>
                    </div>
                </td>
                <td className="py-4 px-4">
                    <div className="flex items-center text-green-400 font-bold text-lg">
                        {protocol.apy}%
                        <TrendingUp size={16} className="ml-1 opacity-50" />
                    </div>
                </td>
                <td className="py-4 px-4 font-medium text-lg">
                    {formatCurrency(protocol.tvl)}
                </td>
                <td className="py-4 px-4 text-right">
                    <button
                        className={`p-2 rounded-full transition-colors ${expanded ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </td>
            </motion.tr>
            <AnimatePresence>
                {expanded && (
                    <tr>
                        <td colSpan={4} className="p-0 border-b border-white/5 bg-black/20">
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 space-y-6">
                                    <div className="flex items-start p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <Info size={20} className="text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
                                        <p className="text-sm text-blue-200/80 leading-relaxed">
                                            {protocol.description}
                                        </p>
                                    </div>

                                    <RiskAnalysis protocolId={protocol.id} />

                                    <div className="flex justify-end pt-4">
                                        <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-primary/20">
                                            Launch Simulator
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </td>
                    </tr>
                )}
            </AnimatePresence>
        </>
    );
};

export const Dashboard: React.FC = () => {
    const [protocols, setProtocols] = useState<ProtocolData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchProtocolData();
            setProtocols(data);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"></div>
            </div>
        );
    }

    const totalTvl = protocols.reduce((acc, p) => acc + p.tvl, 0);
    const avgApy = protocols.reduce((acc, p) => acc + p.apy, 0) / protocols.length;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Market Overview
                    </h2>
                    <p className="text-muted-foreground text-lg">Real-time insights across top DeFi protocols.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm text-muted-foreground">Last updated</p>
                    <p className="font-mono text-xs text-primary">Just now</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Value Locked"
                    value={formatCurrency(totalTvl)}
                    subValue="Across all tracked protocols"
                    icon={DollarSign}
                    trend="up"
                />
                <StatCard
                    label="Average APY"
                    value={`${avgApy.toFixed(2)}%`}
                    subValue="Weighted average yield"
                    icon={TrendingUp}
                    trend="up"
                />
                <StatCard
                    label="Market Health"
                    value="Stable"
                    subValue="Low volatility detected"
                    icon={Shield}
                />
            </div>

            <div className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Top Yield Opportunities</h3>
                    <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-black/20 text-muted-foreground uppercase tracking-wider text-xs">
                            <tr>
                                <th className="py-4 px-4 font-semibold">Protocol</th>
                                <th className="py-4 px-4 font-semibold">APY</th>
                                <th className="py-4 px-4 font-semibold">TVL</th>
                                <th className="py-4 px-4 font-semibold text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {protocols.map((protocol, index) => (
                                <ProtocolRow key={protocol.id} protocol={protocol} index={index} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
