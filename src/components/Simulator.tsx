import React, { useState, useEffect } from 'react';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import type { ProtocolData, SimulationResult } from '../types';
import { fetchProtocolData } from '../services/api';
import { calculateProjectedYield, formatCurrency } from '../utils/calculations';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
                <p className="text-sm font-medium mb-1">Month {label}</p>
                <p className="text-sm text-primary">
                    Value: {formatCurrency(payload[0].value)}
                </p>
                <p className="text-xs text-green-400 mt-1">
                    Yield: +{formatCurrency(payload[0].payload.yieldEarned)}
                </p>
            </div>
        );
    }
    return null;
};

export const Simulator: React.FC = () => {
    const [protocols, setProtocols] = useState<ProtocolData[]>([]);
    const [selectedProtocolId, setSelectedProtocolId] = useState<string>('');
    const [principal, setPrincipal] = useState<number>(10000);
    const [duration, setDuration] = useState<number>(12);
    const [chartData, setChartData] = useState<SimulationResult[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchProtocolData();
            setProtocols(data);
            if (data.length > 0) {
                setSelectedProtocolId(data[0].id);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const protocol = protocols.find(p => p.id === selectedProtocolId);
        if (protocol) {
            const results = calculateProjectedYield(principal, protocol.apy, duration);
            setChartData(results);
        }
    }, [selectedProtocolId, principal, duration, protocols]);

    const selectedProtocol = protocols.find(p => p.id === selectedProtocolId);
    const totalYield = chartData.length > 0 ? chartData[chartData.length - 1].yieldEarned : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls Panel */}
            <div className="lg:col-span-1 space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Simulator</h2>
                    <p className="text-muted-foreground">Project your earnings over time.</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Select Protocol</label>
                        <div className="space-y-2">
                            {protocols.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedProtocolId(p.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${selectedProtocolId === p.id
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border hover:bg-muted/50'
                                        }`}
                                >
                                    <span className="font-medium">{p.name}</span>
                                    <span className="text-sm">{p.apy}% APY</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                            <span>Principal Amount</span>
                            <span className="text-primary font-bold">{formatCurrency(principal)}</span>
                        </label>
                        <div className="flex items-center bg-muted/30 rounded-lg px-3 border border-border">
                            <DollarSign size={16} className="text-muted-foreground" />
                            <input
                                type="range"
                                min="100"
                                max="100000"
                                step="100"
                                value={principal}
                                onChange={(e) => setPrincipal(Number(e.target.value))}
                                className="w-full h-10 bg-transparent ml-2 cursor-pointer accent-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                            <span>Duration (Months)</span>
                            <span className="text-primary font-bold">{duration} Months</span>
                        </label>
                        <div className="flex items-center bg-muted/30 rounded-lg px-3 border border-border">
                            <Calendar size={16} className="text-muted-foreground" />
                            <input
                                type="range"
                                min="1"
                                max="60"
                                step="1"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full h-10 bg-transparent ml-2 cursor-pointer accent-primary"
                            />
                        </div>
                    </div>
                </div>

                {selectedProtocol && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start">
                        <AlertTriangle size={20} className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-medium text-yellow-500 mb-1">Risk Assessment</h4>
                            <p className="text-xs text-yellow-500/80">
                                {selectedProtocol.name} has a risk score of {selectedProtocol.riskScore}/10.
                                {selectedProtocol.riskScore > 5
                                    ? ' Higher returns come with higher volatility.'
                                    : ' This is considered a relatively stable protocol.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Chart Panel */}
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card border border-border p-6 rounded-xl">
                        <p className="text-sm text-muted-foreground mb-1">Projected Balance</p>
                        <p className="text-3xl font-bold text-foreground">
                            {formatCurrency(principal + totalYield)}
                        </p>
                    </div>
                    <div className="bg-card border border-border p-6 rounded-xl">
                        <p className="text-sm text-muted-foreground mb-1">Total Yield Earned</p>
                        <p className="text-3xl font-bold text-green-500">
                            +{formatCurrency(totalYield)}
                        </p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 h-[400px]">
                    <h3 className="text-lg font-semibold mb-6">Growth Projection</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis
                                dataKey="month"
                                stroke="hsl(var(--muted-foreground))"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `M${value}`}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
