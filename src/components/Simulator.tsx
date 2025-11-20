import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';
import type { ProtocolData, SimulationResult } from '../types';
import { fetchProtocolData } from '../services/api';
import { calculateProjectedYield, formatCurrency } from '../utils/calculations';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card/90 backdrop-blur-md border border-border/40 p-4 rounded-xl shadow-xl">
                <p className="text-sm font-medium mb-2 text-muted-foreground">Month {label}</p>
                <div className="space-y-1">
                    <p className="text-sm text-primary font-bold flex items-center">
                        <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                        Value: {formatCurrency(payload[0].value)}
                    </p>
                    {payload[1] && (
                        <p className="text-sm text-green-400 font-bold flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                            Return: +{formatCurrency(payload[1].value)}
                        </p>
                    )}
                </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            {/* Controls Panel */}
            <div className="lg:col-span-1 space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                        Simulator
                    </h2>
                    <p className="text-muted-foreground">Project your earnings over time.</p>
                </div>

                <div className="bg-card/30 backdrop-blur-xl border border-border/40 rounded-2xl p-6 space-y-8 shadow-lg">
                    <div>
                        <label className="block text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wider">Select Protocol</label>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {protocols.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedProtocolId(p.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${selectedProtocolId === p.id
                                        ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]'
                                        : 'border-border/40 hover:bg-muted/20 text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-3 ${selectedProtocolId === p.id ? 'bg-primary' : 'bg-muted'}`} />
                                        <span className="font-medium">{p.name}</span>
                                    </div>
                                    <span className="text-sm font-bold">{p.apy}% APY</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                                <span className="text-muted-foreground">Principal Amount</span>
                                <span className="text-foreground font-bold text-lg">{formatCurrency(principal)}</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <DollarSign size={16} />
                                </div>
                                <input
                                    type="range"
                                    min="100"
                                    max="100000"
                                    step="100"
                                    value={principal}
                                    onChange={(e) => setPrincipal(Number(e.target.value))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="text-foreground font-bold text-lg">{duration} Months</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Calendar size={16} />
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="60"
                                    step="1"
                                    value={duration}
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {selectedProtocol && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start backdrop-blur-sm">
                        <AlertTriangle size={20} className="text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-yellow-500 mb-1">Risk Assessment</h4>
                            <p className="text-xs text-yellow-500/70 leading-relaxed">
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
                    <div className="bg-card/30 backdrop-blur-xl border border-border/40 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-foreground">
                            <DollarSign size={64} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1 font-medium uppercase tracking-wider">Projected Balance</p>
                        <p className="text-4xl font-bold text-foreground tracking-tight">
                            {formatCurrency(principal + totalYield)}
                        </p>
                    </div>
                    <div className="bg-card/30 backdrop-blur-xl border border-border/40 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-foreground">
                            <TrendingUp size={64} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1 font-medium uppercase tracking-wider">Total Yield Earned</p>
                        <p className="text-4xl font-bold text-green-400 tracking-tight">
                            +{formatCurrency(totalYield)}
                        </p>
                    </div>
                </div>

                <div className="bg-card/30 backdrop-blur-xl border border-border/40 rounded-2xl p-6 h-[500px] flex flex-col">
                    <h3 className="text-lg font-semibold mb-6 flex items-center text-foreground">
                        <TrendingUp size={18} className="mr-2 text-primary" />
                        Growth Projection
                    </h3>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="hsl(var(--muted-foreground))"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `M${value}`}
                                    tick={{ fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="hsl(var(--muted-foreground))"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 2 }} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    name="Total Value"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="yieldEarned"
                                    stroke="#4ade80"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorYield)"
                                    name="Yield Earned"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
