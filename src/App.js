import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Percent, Calculator } from 'lucide-react';

const PROTOCOLS = {
  uniswap: {
    name: 'Uniswap',
    description: 'Liquidity Provider',
    baseAPY: 15,
    color: '#FF007A',
    icon: '🦄'
  },
  aave: {
    name: 'Aave',
    description: 'Lending Protocol',
    baseAPY: 3.5,
    color: '#B6509E',
    icon: '👻'
  },
  makerdao: {
    name: 'MakerDAO',
    description: 'DAI Stability',
    baseAPY: 5,
    color: '#1AAB9B',
    icon: '🏛️'
  },
  yearn: {
    name: 'Yearn',
    description: 'Yield Aggregator',
    baseAPY: 8,
    color: '#0657F9',
    icon: '💰'
  }
};

export default function App() {
  const [selectedProtocol, setSelectedProtocol] = useState('uniswap');
  const [investment, setInvestment] = useState(10000);
  const [timeframe, setTimeframe] = useState(12);
  const [compounding, setCompounding] = useState('monthly');
  const [chartData, setChartData] = useState([]);
  const [totalReturn, setTotalReturn] = useState(0);
  const [ethPrice, setEthPrice] = useState(null);
  const [daiPrice, setDaiPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, []);

  useEffect(() => {
    calculateYield();
  }, [selectedProtocol, investment, timeframe, compounding]);

  const fetchPrices = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,dai&vs_currencies=usd'
      );
      const data = await response.json();
      setEthPrice(data.ethereum?.usd || null);
      setDaiPrice(data.dai?.usd || null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setLoading(false);
    }
  };

  const calculateYield = () => {
    const protocol = PROTOCOLS[selectedProtocol];
    const apy = protocol.baseAPY / 100;
    const periods = timeframe;
    
    let compoundFrequency = 12;
    if (compounding === 'daily') compoundFrequency = 365;
    if (compounding === 'weekly') compoundFrequency = 52;
    if (compounding === 'monthly') compoundFrequency = 12;
    if (compounding === 'yearly') compoundFrequency = 1;

    const data = [];
    let currentValue = investment;

    for (let month = 0; month <= periods; month++) {
      if (month > 0) {
        const periodsElapsed = (month / 12) * compoundFrequency;
        currentValue = investment * Math.pow(1 + (apy / compoundFrequency), periodsElapsed);
      }
      
      data.push({
        month: month,
        value: parseFloat(currentValue.toFixed(2)),
        profit: parseFloat((currentValue - investment).toFixed(2))
      });
    }

    setChartData(data);
    setTotalReturn(data[data.length - 1].value);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const protocol = PROTOCOLS[selectedProtocol];
  const profitAmount = totalReturn - investment;
  const profitPercentage = ((profitAmount / investment) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <TrendingUp className="text-indigo-600" />
            DeFi Yield Simulator
          </h1>
          <p className="text-gray-600">Compare yields across Uniswap, Aave, MakerDAO, and Yearn</p>
        </div>

        {/* Live Prices */}
        {!loading && (ethPrice || daiPrice) && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-center gap-8">
            {ethPrice && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">ETH:</span>
                <span className="font-semibold text-lg">{formatCurrency(ethPrice)}</span>
              </div>
            )}
            {daiPrice && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">DAI:</span>
                <span className="font-semibold text-lg">{formatCurrency(daiPrice)}</span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Protocol Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calculator className="text-indigo-600" />
                Select Protocol
              </h2>
              <div className="space-y-3">
                {Object.entries(PROTOCOLS).map(([key, proto]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedProtocol(key)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedProtocol === key
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{proto.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{proto.name}</div>
                        <div className="text-sm text-gray-600">{proto.description}</div>
                        <div className="text-sm font-medium mt-1" style={{ color: proto.color }}>
                          {proto.baseAPY}% APY
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Investment Parameters */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="text-indigo-600" />
                Investment Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Investment: {formatCurrency(investment)}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={investment}
                    onChange={(e) => setInvestment(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$100</span>
                    <span>$100,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeframe: {timeframe} months
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={timeframe}
                    onChange={(e) => setTimeframe(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 month</span>
                    <span>5 years</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compounding Frequency
                  </label>
                  <select
                    value={compounding}
                    onChange={(e) => setCompounding(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <DollarSign size={20} />
                  <span className="text-sm font-medium">Initial Investment</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(investment)}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <TrendingUp size={20} />
                  <span className="text-sm font-medium">Total Return</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalReturn)}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Percent size={20} />
                  <span className="text-sm font-medium">Profit</span>
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(profitAmount)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  +{profitPercentage}%
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Growth Projection</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => `Month ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={protocol.color}
                    strokeWidth={3}
                    name="Portfolio Value"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Profit"
                    dot={false}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Protocol Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-3">About {protocol.name}</h2>
              <div className="space-y-2 text-gray-700">
                {selectedProtocol === 'uniswap' && (
                  <>
                    <p>• Leading decentralized exchange (DEX) on Ethereum</p>
                    <p>• Earn 0.3% trading fees as a liquidity provider</p>
                    <p>• Uses an Automated Market Maker (AMM) model</p>
                    <p>• Direct token swaps from your wallet</p>
                  </>
                )}
                {selectedProtocol === 'aave' && (
                  <>
                    <p>• Lending and borrowing protocol for crypto assets</p>
                    <p>• Depositors earn interest, borrowers use collateralized loans</p>
                    <p>• Features flash loans and variable/fixed interest rates</p>
                    <p>• Supports multi-chain deployments</p>
                  </>
                )}
                {selectedProtocol === 'makerdao' && (
                  <>
                    <p>• Protocol behind the DAI stablecoin (pegged to USD)</p>
                    <p>• Lock crypto as collateral to mint DAI</p>
                    <p>• Ensures system stability through over-collateralization</p>
                    <p>• Early pioneer of decentralized lending in DeFi</p>
                  </>
                )}
                {selectedProtocol === 'yearn' && (
                  <>
                    <p>• Yield aggregator automating yield farming strategies</p>
                    <p>• Moves funds across protocols like Aave and Compound</p>
                    <p>• Offers Vaults that maximize and auto-compound yields</p>
                    <p>• Simplifies DeFi investing for non-technical users</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <strong>Disclaimer:</strong> This simulator uses estimated APY rates for educational purposes. 
          Actual yields vary based on market conditions, liquidity, and other factors. 
          Always do your own research before investing in DeFi protocols.
        </div>
      </div>
    </div>
  );
}