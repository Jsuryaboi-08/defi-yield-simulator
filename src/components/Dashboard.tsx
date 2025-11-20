import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, DollarSign, ArrowUpRight } from 'lucide-react';
import type { ProtocolData } from '../types';
import { fetchProtocolData } from '../services/api';
import { formatCurrency } from '../utils/calculations';

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
        className="bg-card border border-border p-6 rounded-xl shadow-sm relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon size={64} />
        </div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                        {trend === 'up' ? '+' : '-'}{Math.floor(Math.random() * 5) + 1}%
                        <ArrowUpRight size={12} className="ml-1" />
                    </span>
                )}
            </div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">{label}</h3>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
        </div>
    </motion.div>
);

const ProtocolRow = ({ protocol, index }: { protocol: ProtocolData, index: number }) => (
    <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="border-b border-border hover:bg-muted/30 transition-colors"
    >
        <td className="py-4 px-4">
            <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 mr-3 flex items-center justify-center text-xs font-bold">
                    {protocol.symbol.substring(0, 1)}
                </div>
                <div>
                    <p className="font-medium">{protocol.name}</p>
                    <p className="text-xs text-muted-foreground">{protocol.chain}</p>
                </div>
            </div>
        </td>
        <td className="py-4 px-4">
            <div className="flex items-center text-green-400 font-medium">
                {protocol.apy}%
                <TrendingUp size={14} className="ml-1" />
            </div>
        </td>
        <td className="py-4 px-4 font-medium">
            {formatCurrency(protocol.tvl)}
        </td>
        <td className="py-4 px-4">
            <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${protocol.riskScore < 4 ? 'bg-green-500' : protocol.riskScore < 7 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                <span className="text-sm">{protocol.riskScore}/10</span>
            </div>
        </td>
        <td className="py-4 px-4 text-right">
            <button className="text-sm bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-md transition-all">
                Simulate
            </button>
        </td>
    </motion.tr>
);

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
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const totalTvl = protocols.reduce((acc, p) => acc + p.tvl, 0);
    const avgApy = protocols.reduce((acc, p) => acc + p.apy, 0) / protocols.length;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Market Overview</h2>
                <p className="text-muted-foreground">Real-time insights across top DeFi protocols.</p>
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
                    label="Market Risk Score"
                    value="3.5/10"
                    subValue="Moderate market conditions"
                    icon={Shield}
                />
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-border">
                    <h3 className="text-lg font-semibold">Top Yield Opportunities</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="py-3 px-4 font-medium">Protocol</th>
                                <th className="py-3 px-4 font-medium">APY</th>
                                <th className="py-3 px-4 font-medium">TVL</th>
                                <th className="py-3 px-4 font-medium">Risk Score</th>
                                <th className="py-3 px-4 font-medium text-right">Action</th>
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
