"use client";

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AgencyCosts {
  platform: number;
  usage: number;
  addOns: number;
}

interface ClientRevenue {
  subscriptions: number;
  rebilling: number;
  setupFees: number;
}

interface ProfitDashboardProps {
  agencyCosts: AgencyCosts;
  clientRevenue: ClientRevenue;
  clientCount: number;
  projectionMonths?: number;
}

interface ScenarioMetrics {
  name: string;
  monthlyGrowth: number;
  churnRate: number;
  mrr6mo: number;
  mrr12mo: number;
  mrr24mo: number;
  clients6mo: number;
  clients12mo: number;
  clients24mo: number;
}

const ProfitDashboard: React.FC<ProfitDashboardProps> = ({
  agencyCosts,
  clientRevenue,
  clientCount,
  projectionMonths = 12
}) => {
  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalRevenue = clientRevenue.subscriptions + clientRevenue.rebilling + clientRevenue.setupFees;
    const totalCosts = agencyCosts.platform + agencyCosts.usage + agencyCosts.addOns;
    const netProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
    const revenuePerClient = clientCount > 0 ? totalRevenue / clientCount : 0;
    const costPerClient = clientCount > 0 ? totalCosts / clientCount : 0;

    return {
      mrr: totalRevenue,
      costs: totalCosts,
      netProfit,
      profitMargin,
      revenuePerClient,
      costPerClient
    };
  }, [agencyCosts, clientRevenue, clientCount]);

  // Generate revenue vs costs projection data
  const projectionData = useMemo(() => {
    const data = [];
    const monthlyGrowth = 0.1; // 10% monthly growth

    for (let i = 0; i <= projectionMonths; i++) {
      const growthMultiplier = Math.pow(1 + monthlyGrowth, i);
      const revenue = metrics.mrr * growthMultiplier;
      const costs = metrics.costs * (1 + (growthMultiplier - 1) * 0.6); // Costs grow slower

      data.push({
        month: i === 0 ? 'Now' : `Month ${i}`,
        revenue: Math.round(revenue),
        costs: Math.round(costs),
        profit: Math.round(revenue - costs)
      });
    }

    return data;
  }, [metrics, projectionMonths]);

  // Revenue breakdown data
  const revenueBreakdown = useMemo(() => [
    { name: 'Subscriptions', value: clientRevenue.subscriptions, color: '#10b981' },
    { name: 'Rebilling', value: clientRevenue.rebilling, color: '#3b82f6' },
    { name: 'Setup Fees', value: clientRevenue.setupFees, color: '#8b5cf6' },
    { name: 'Other', value: 0, color: '#6b7280' }
  ].filter(item => item.value > 0), [clientRevenue]);

  // Cost breakdown data
  const costBreakdown = useMemo(() => [
    { name: 'Platform', value: agencyCosts.platform, color: '#ef4444' },
    { name: 'Usage', value: agencyCosts.usage, color: '#f59e0b' },
    { name: 'Add-ons', value: agencyCosts.addOns, color: '#ec4899' },
    { name: 'Overhead', value: 0, color: '#6b7280' }
  ].filter(item => item.value > 0), [agencyCosts]);

  // Profit margin trend with scenarios
  const marginTrendData = useMemo(() => {
    const data = [];

    for (let i = 0; i <= projectionMonths; i++) {
      const conservative = Math.pow(1.05, i);
      const moderate = Math.pow(1.10, i);
      const aggressive = Math.pow(1.20, i);

      const baseMargin = metrics.profitMargin;

      data.push({
        month: i === 0 ? 'Now' : `M${i}`,
        conservative: Math.min(baseMargin * (1 + (conservative - 1) * 0.3), 80),
        moderate: Math.min(baseMargin * (1 + (moderate - 1) * 0.4), 85),
        aggressive: Math.min(baseMargin * (1 + (aggressive - 1) * 0.5), 90)
      });
    }

    return data;
  }, [metrics.profitMargin, projectionMonths]);

  // Client growth impact data
  const clientGrowthData = useMemo(() => {
    const revenuePerClient = metrics.revenuePerClient;
    const costPerClient = metrics.costPerClient;

    return [
      { scenario: 'Current', clients: clientCount, revenue: metrics.mrr, profit: metrics.netProfit },
      { scenario: '+10 Clients', clients: clientCount + 10, revenue: (clientCount + 10) * revenuePerClient, profit: (clientCount + 10) * (revenuePerClient - costPerClient) },
      { scenario: '+25 Clients', clients: clientCount + 25, revenue: (clientCount + 25) * revenuePerClient, profit: (clientCount + 25) * (revenuePerClient - costPerClient) },
      { scenario: '+50 Clients', clients: clientCount + 50, revenue: (clientCount + 50) * revenuePerClient, profit: (clientCount + 50) * (revenuePerClient - costPerClient) },
      { scenario: '+100 Clients', clients: clientCount + 100, revenue: (clientCount + 100) * revenuePerClient, profit: (clientCount + 100) * (revenuePerClient - costPerClient) }
    ];
  }, [clientCount, metrics]);

  // Scenario comparison
  const scenarios = useMemo((): ScenarioMetrics[] => {
    const calculateScenario = (name: string, monthlyGrowth: number, churnRate: number): ScenarioMetrics => {
      const netGrowthRate = monthlyGrowth - churnRate;

      const clients6mo = Math.round(clientCount * Math.pow(1 + netGrowthRate / 100, 6));
      const clients12mo = Math.round(clientCount * Math.pow(1 + netGrowthRate / 100, 12));
      const clients24mo = Math.round(clientCount * Math.pow(1 + netGrowthRate / 100, 24));

      const mrr6mo = clients6mo * metrics.revenuePerClient;
      const mrr12mo = clients12mo * metrics.revenuePerClient;
      const mrr24mo = clients24mo * metrics.revenuePerClient;

      return {
        name,
        monthlyGrowth,
        churnRate,
        mrr6mo,
        mrr12mo,
        mrr24mo,
        clients6mo,
        clients12mo,
        clients24mo
      };
    };

    return [
      calculateScenario('Conservative', 5, 5),
      calculateScenario('Moderate', 10, 3),
      calculateScenario('Aggressive', 20, 2)
    ];
  }, [clientCount, metrics.revenuePerClient]);

  // Break-even analysis
  const breakEvenAnalysis = useMemo(() => {
    const fixedCosts = agencyCosts.platform + agencyCosts.addOns;
    const variableCostPerClient = clientCount > 0 ? agencyCosts.usage / clientCount : 0;
    const pricePerClient = metrics.revenuePerClient;
    const contributionMargin = pricePerClient - variableCostPerClient;

    const breakEvenClients = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
    const monthsToBreakEven = clientCount >= breakEvenClients ? 0 :
      Math.ceil((breakEvenClients - clientCount) / (clientCount * 0.1)); // Assuming 10% monthly growth

    return {
      fixedCosts,
      variableCostPerClient,
      pricePerClient,
      breakEvenClients,
      monthsToBreakEven,
      currentlyProfitable: clientCount >= breakEvenClients
    };
  }, [agencyCosts, clientCount, metrics.revenuePerClient]);

  // Export function
  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      metrics,
      breakEvenAnalysis,
      scenarios,
      clientCount,
      agencyCosts,
      clientRevenue,
      projectionData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-lg shadow-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Profit Margin Dashboard</h1>
            <p className="text-slate-300">Comprehensive financial overview and projections</p>
          </div>
          <button
            onClick={handleExport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
          >
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <MetricCard
          title="Monthly Recurring Revenue"
          value={formatCurrency(metrics.mrr)}
          subtitle="Total MRR"
          bgColor="bg-emerald-500"
        />
        <MetricCard
          title="Monthly Costs"
          value={formatCurrency(metrics.costs)}
          subtitle="Total expenses"
          bgColor="bg-red-500"
        />
        <MetricCard
          title="Net Profit"
          value={formatCurrency(metrics.netProfit)}
          subtitle="MRR - Costs"
          bgColor={metrics.netProfit >= 0 ? "bg-blue-500" : "bg-orange-500"}
        />
        <MetricCard
          title="Profit Margin"
          value={formatPercent(metrics.profitMargin)}
          subtitle="Profitability"
          bgColor="bg-purple-500"
        />
        <MetricCard
          title="Revenue per Client"
          value={formatCurrency(metrics.revenuePerClient)}
          subtitle="Average value"
          bgColor="bg-cyan-500"
        />
        <MetricCard
          title="Cost per Client"
          value={formatCurrency(metrics.costPerClient)}
          subtitle="Average cost"
          bgColor="bg-pink-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue vs Costs Over Time */}
        <ChartCard title="Revenue vs Costs Projection">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Revenue" />
              <Area type="monotone" dataKey="costs" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Costs" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue Breakdown */}
        <ChartCard title="Revenue Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cost Breakdown */}
        <ChartCard title="Cost Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Profit Margin Trend */}
        <ChartCard title="Profit Margin Trend by Scenario">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={marginTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
              />
              <Legend />
              <Line type="monotone" dataKey="conservative" stroke="#f59e0b" strokeWidth={2} name="Conservative" dot={false} />
              <Line type="monotone" dataKey="moderate" stroke="#3b82f6" strokeWidth={2} name="Moderate" dot={false} />
              <Line type="monotone" dataKey="aggressive" stroke="#10b981" strokeWidth={2} name="Aggressive" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Client Growth Impact */}
      <div className="mb-8">
        <ChartCard title="Client Growth Impact on Revenue">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="scenario" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="profit" fill="#10b981" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Scenario Comparison Table */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Scenario Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-3 px-4 text-slate-700 font-semibold">Scenario</th>
                <th className="text-center py-3 px-4 text-slate-700 font-semibold">Growth Rate</th>
                <th className="text-center py-3 px-4 text-slate-700 font-semibold">Churn Rate</th>
                <th className="text-right py-3 px-4 text-slate-700 font-semibold">MRR @ 6mo</th>
                <th className="text-right py-3 px-4 text-slate-700 font-semibold">MRR @ 12mo</th>
                <th className="text-right py-3 px-4 text-slate-700 font-semibold">MRR @ 24mo</th>
                <th className="text-center py-3 px-4 text-slate-700 font-semibold">Clients @ 12mo</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((scenario, index) => (
                <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800">{scenario.name}</td>
                  <td className="py-3 px-4 text-center text-emerald-600">{scenario.monthlyGrowth}%</td>
                  <td className="py-3 px-4 text-center text-red-600">{scenario.churnRate}%</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(scenario.mrr6mo)}</td>
                  <td className="py-3 px-4 text-right font-semibold">{formatCurrency(scenario.mrr12mo)}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(scenario.mrr24mo)}</td>
                  <td className="py-3 px-4 text-center">{scenario.clients12mo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Break-Even Analysis */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Break-Even Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-slate-600 text-sm mb-1">Fixed Costs (Monthly)</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(breakEvenAnalysis.fixedCosts)}</p>
          </div>
          <div>
            <p className="text-slate-600 text-sm mb-1">Variable Cost per Client</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(breakEvenAnalysis.variableCostPerClient)}</p>
          </div>
          <div>
            <p className="text-slate-600 text-sm mb-1">Price per Client</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(breakEvenAnalysis.pricePerClient)}</p>
          </div>
          <div>
            <p className="text-slate-600 text-sm mb-1">Break-Even Client Count</p>
            <p className="text-2xl font-bold text-emerald-600">{breakEvenAnalysis.breakEvenClients} clients</p>
          </div>
          <div>
            <p className="text-slate-600 text-sm mb-1">Months to Break-Even</p>
            <p className="text-2xl font-bold text-blue-600">
              {breakEvenAnalysis.monthsToBreakEven === 0 ? 'Already Profitable!' : `${breakEvenAnalysis.monthsToBreakEven} months`}
            </p>
          </div>
          <div>
            <p className="text-slate-600 text-sm mb-1">Current Status</p>
            <p className={`text-2xl font-bold ${breakEvenAnalysis.currentlyProfitable ? 'text-emerald-600' : 'text-orange-600'}`}>
              {breakEvenAnalysis.currentlyProfitable ? 'Profitable' : 'Growing'}
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-slate-100 rounded-lg">
          <p className="text-slate-700">
            <span className="font-semibold">Insight:</span> You need {breakEvenAnalysis.breakEvenClients} clients to break even.
            You currently have {clientCount} clients, which means you are {
              breakEvenAnalysis.currentlyProfitable
                ? `${clientCount - breakEvenAnalysis.breakEvenClients} clients above break-even.`
                : `${breakEvenAnalysis.breakEvenClients - clientCount} clients away from break-even.`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper Components
interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  bgColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, bgColor }) => (
  <div className={`${bgColor} rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200`}>
    <h3 className="text-sm font-semibold mb-2 opacity-90">{title}</h3>
    <p className="text-3xl font-bold mb-1">{value}</p>
    <p className="text-xs opacity-80">{subtitle}</p>
  </div>
);

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
    {children}
  </div>
);

export default ProfitDashboard;
