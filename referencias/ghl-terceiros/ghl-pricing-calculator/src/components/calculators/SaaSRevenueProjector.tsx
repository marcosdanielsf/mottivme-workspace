'use client';

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface PricingTier {
  id: string;
  name: string;
  monthlyPrice: number;
  clientCount: number;
  setupFee: number;
  enabled: boolean;
}

interface AgencyCosts {
  ghlPlanCost: number;
  usageCostPerClient: number;
  supportCostPerClient: number;
}

interface Rebilling {
  smsMarkup: number;
  emailMarkup: number;
  aiServicesMarkup: number;
  usageVolumePerClient: number;
}

interface GrowthMetrics {
  monthlyGrowthRate: number;
  monthlyChurnRate: number;
  projectionPeriod: number;
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function SaaSRevenueProjector() {
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    { id: '1', name: 'Starter', monthlyPrice: 297, clientCount: 10, setupFee: 500, enabled: true },
    { id: '2', name: 'Pro', monthlyPrice: 497, clientCount: 5, setupFee: 1000, enabled: true },
    { id: '3', name: 'Enterprise', monthlyPrice: 997, clientCount: 2, setupFee: 2500, enabled: true },
    { id: '4', name: '', monthlyPrice: 0, clientCount: 0, setupFee: 0, enabled: false },
    { id: '5', name: '', monthlyPrice: 0, clientCount: 0, setupFee: 0, enabled: false },
  ]);

  const [agencyCosts, setAgencyCosts] = useState<AgencyCosts>({
    ghlPlanCost: 497,
    usageCostPerClient: 15,
    supportCostPerClient: 25,
  });

  const [rebilling, setRebilling] = useState<Rebilling>({
    smsMarkup: 50,
    emailMarkup: 30,
    aiServicesMarkup: 40,
    usageVolumePerClient: 50,
  });

  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetrics>({
    monthlyGrowthRate: 10,
    monthlyChurnRate: 5,
    projectionPeriod: 12,
  });

  const updateTier = (id: string, field: keyof PricingTier, value: string | number | boolean) => {
    setPricingTiers(tiers =>
      tiers.map(tier => (tier.id === id ? { ...tier, [field]: value } : tier))
    );
  };

  const toggleTier = (id: string) => {
    setPricingTiers(tiers =>
      tiers.map(tier => (tier.id === id ? { ...tier, enabled: !tier.enabled } : tier))
    );
  };

  // Calculate projections
  const projections = useMemo(() => {
    const activeTiers = pricingTiers.filter(t => t.enabled && t.clientCount > 0);
    const months = [];

    for (let month = 0; month <= growthMetrics.projectionPeriod; month++) {
      const tierData: Record<string, number> = {};
      let totalClients = 0;
      let totalMRR = 0;
      let totalSetupFees = 0;

      activeTiers.forEach(tier => {
        // Calculate client growth with churn
        const growthFactor = Math.pow(
          1 + (growthMetrics.monthlyGrowthRate - growthMetrics.monthlyChurnRate) / 100,
          month
        );
        const clients = Math.round(tier.clientCount * growthFactor);
        const revenue = clients * tier.monthlyPrice;

        tierData[tier.name] = revenue;
        tierData[`${tier.name}_clients`] = clients;
        totalClients += clients;
        totalMRR += revenue;

        // Setup fees only for new clients
        if (month > 0) {
          const previousClients = Math.round(
            tier.clientCount * Math.pow(
              1 + (growthMetrics.monthlyGrowthRate - growthMetrics.monthlyChurnRate) / 100,
              month - 1
            )
          );
          const newClients = Math.max(0, clients - previousClients);
          totalSetupFees += newClients * tier.setupFee;
        } else {
          totalSetupFees += tier.clientCount * tier.setupFee;
        }
      });

      // Calculate rebilling profit
      const rebillingProfit = totalClients * rebilling.usageVolumePerClient * (
        (rebilling.smsMarkup + rebilling.emailMarkup + rebilling.aiServicesMarkup) / 100
      );

      // Calculate total costs
      const totalCosts = agencyCosts.ghlPlanCost +
        totalClients * (agencyCosts.usageCostPerClient + agencyCosts.supportCostPerClient);

      const totalRevenue = totalMRR + rebillingProfit;
      const netProfit = totalRevenue - totalCosts;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      months.push({
        month,
        ...tierData,
        totalClients,
        MRR: totalMRR,
        rebillingProfit,
        setupFees: totalSetupFees,
        totalRevenue,
        totalCosts,
        netProfit,
        profitMargin,
      });
    }

    return months;
  }, [pricingTiers, agencyCosts, rebilling, growthMetrics]);

  // Current month metrics
  const currentMetrics = projections[0];
  const finalMetrics = projections[projections.length - 1];

  // Calculate LTV and CAC breakeven
  const avgClientValue = useMemo(() => {
    const activeTiers = pricingTiers.filter(t => t.enabled && t.clientCount > 0);
    const totalClients = activeTiers.reduce((sum, t) => sum + t.clientCount, 0);
    const totalRevenue = activeTiers.reduce((sum, t) => sum + t.clientCount * t.monthlyPrice, 0);
    return totalClients > 0 ? totalRevenue / totalClients : 0;
  }, [pricingTiers]);

  const avgLifetimeMonths = growthMetrics.monthlyChurnRate > 0
    ? 1 / (growthMetrics.monthlyChurnRate / 100)
    : 24;

  const ltv = avgClientValue * avgLifetimeMonths;

  // Revenue breakdown for pie chart
  const revenueBreakdown = useMemo(() => {
    return pricingTiers
      .filter(t => t.enabled && t.clientCount > 0)
      .map(tier => ({
        name: tier.name,
        value: tier.clientCount * tier.monthlyPrice,
      }));
  }, [pricingTiers]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          SaaS Revenue Projector
        </h2>
        <p className="text-gray-600 mb-6">
          Model your GoHighLevel SaaS business revenue with pricing tiers, growth projections, and cost analysis
        </p>

        {/* Pricing Tiers */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Client Pricing Tiers
          </h3>
          <div className="space-y-4">
            {pricingTiers.map((tier, index) => (
              <div
                key={tier.id}
                className={`border rounded-lg p-4 ${
                  tier.enabled ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={tier.enabled}
                    onChange={() => toggleTier(tier.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="ml-3 text-lg font-medium text-gray-900">
                    Tier {index + 1}
                  </label>
                </div>

                {tier.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tier Name
                      </label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={e => updateTier(tier.id, 'name', e.target.value)}
                        placeholder="e.g., Starter"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={tier.monthlyPrice || ''}
                          onChange={e => updateTier(tier.id, 'monthlyPrice', parseFloat(e.target.value) || 0)}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Clients
                      </label>
                      <input
                        type="number"
                        value={tier.clientCount || ''}
                        onChange={e => updateTier(tier.id, 'clientCount', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Setup Fee
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={tier.setupFee || ''}
                          onChange={e => updateTier(tier.id, 'setupFee', parseFloat(e.target.value) || 0)}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Growth Projections */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Growth Projections
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Growth Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={growthMetrics.monthlyGrowthRate}
                  onChange={e => setGrowthMetrics({ ...growthMetrics, monthlyGrowthRate: parseFloat(e.target.value) || 0 })}
                  step="0.5"
                  className="w-full pr-8 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Churn Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={growthMetrics.monthlyChurnRate}
                  onChange={e => setGrowthMetrics({ ...growthMetrics, monthlyChurnRate: parseFloat(e.target.value) || 0 })}
                  step="0.5"
                  className="w-full pr-8 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Projection Period
              </label>
              <select
                value={growthMetrics.projectionPeriod}
                onChange={e => setGrowthMetrics({ ...growthMetrics, projectionPeriod: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
                <option value={24}>24 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Net Growth Rate
              </label>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 font-medium">
                {(growthMetrics.monthlyGrowthRate - growthMetrics.monthlyChurnRate).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Agency Costs */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Agency Costs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GHL Plan Cost
              </label>
              <select
                value={agencyCosts.ghlPlanCost}
                onChange={e => setAgencyCosts({ ...agencyCosts, ghlPlanCost: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={297}>Agency Starter - $297/mo</option>
                <option value={497}>Agency Unlimited - $497/mo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage Cost per Client
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={agencyCosts.usageCostPerClient}
                  onChange={e => setAgencyCosts({ ...agencyCosts, usageCostPerClient: parseFloat(e.target.value) || 0 })}
                  step="0.5"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support/Overhead per Client
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={agencyCosts.supportCostPerClient}
                  onChange={e => setAgencyCosts({ ...agencyCosts, supportCostPerClient: parseFloat(e.target.value) || 0 })}
                  step="0.5"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rebilling Revenue */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Rebilling Revenue
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMS Markup
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={rebilling.smsMarkup}
                  onChange={e => setRebilling({ ...rebilling, smsMarkup: parseFloat(e.target.value) || 0 })}
                  step="5"
                  className="w-full pr-8 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Markup
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={rebilling.emailMarkup}
                  onChange={e => setRebilling({ ...rebilling, emailMarkup: parseFloat(e.target.value) || 0 })}
                  step="5"
                  className="w-full pr-8 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AI Services Markup
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={rebilling.aiServicesMarkup}
                  onChange={e => setRebilling({ ...rebilling, aiServicesMarkup: parseFloat(e.target.value) || 0 })}
                  step="5"
                  className="w-full pr-8 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usage Volume per Client
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={rebilling.usageVolumePerClient}
                  onChange={e => setRebilling({ ...rebilling, usageVolumePerClient: parseFloat(e.target.value) || 0 })}
                  step="5"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Current Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-600 mb-1">Total Clients</div>
              <div className="text-2xl font-bold text-blue-900">{currentMetrics.totalClients}</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-600 mb-1">Monthly MRR</div>
              <div className="text-2xl font-bold text-green-900">
                ${currentMetrics.MRR.toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="text-sm font-medium text-purple-600 mb-1">Annual ARR</div>
              <div className="text-2xl font-bold text-purple-900">
                ${(currentMetrics.MRR * 12).toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
              <div className="text-sm font-medium text-amber-600 mb-1">Setup Fees</div>
              <div className="text-2xl font-bold text-amber-900">
                ${currentMetrics.setupFees.toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
              <div className="text-sm font-medium text-cyan-600 mb-1">Rebilling Profit</div>
              <div className="text-2xl font-bold text-cyan-900">
                ${currentMetrics.rebillingProfit.toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
              <div className="text-sm font-medium text-emerald-600 mb-1">Total Revenue</div>
              <div className="text-2xl font-bold text-emerald-900">
                ${currentMetrics.totalRevenue.toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-50 to-rose-100 p-4 rounded-lg border border-rose-200">
              <div className="text-sm font-medium text-rose-600 mb-1">Total Costs</div>
              <div className="text-2xl font-bold text-rose-900">
                ${currentMetrics.totalCosts.toLocaleString()}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
              <div className="text-sm font-medium text-indigo-600 mb-1">Net Profit</div>
              <div className="text-2xl font-bold text-indigo-900">
                ${currentMetrics.netProfit.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Projection Metrics */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {growthMetrics.projectionPeriod}-Month Projection
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-600 mb-1">Projected Clients</div>
              <div className="text-2xl font-bold text-blue-900">{finalMetrics.totalClients}</div>
              <div className="text-xs text-blue-600 mt-1">
                +{((finalMetrics.totalClients / currentMetrics.totalClients - 1) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="text-sm font-medium text-green-600 mb-1">Projected MRR</div>
              <div className="text-2xl font-bold text-green-900">
                ${finalMetrics.MRR.toLocaleString()}
              </div>
              <div className="text-xs text-green-600 mt-1">
                +{((finalMetrics.MRR / currentMetrics.MRR - 1) * 100).toFixed(1)}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="text-sm font-medium text-purple-600 mb-1">Client LTV</div>
              <div className="text-2xl font-bold text-purple-900">
                ${ltv.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-purple-600 mt-1">
                ~{avgLifetimeMonths.toFixed(1)} months
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
              <div className="text-sm font-medium text-amber-600 mb-1">Profit Margin</div>
              <div className="text-2xl font-bold text-amber-900">
                {currentMetrics.profitMargin.toFixed(1)}%
              </div>
              <div className="text-xs text-amber-600 mt-1">
                Current month
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Projection Chart */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Revenue Projection Over Time
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={projections}>
                <XAxis
                  dataKey="month"
                  label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="MRR"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="MRR"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="rebillingProfit"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Rebilling"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Total Revenue"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="netProfit"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Net Profit"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown and Profit Margin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Revenue Breakdown Pie Chart */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Revenue Breakdown by Tier
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit Margin Trend */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Profit Margin Trend
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projections}>
                  <XAxis
                    dataKey="month"
                    label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    label={{ value: 'Margin (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="profitMargin"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Profit Margin %"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Summary Insights
          </h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-semibold">Current State:</span> You have {currentMetrics.totalClients} clients
              generating ${currentMetrics.MRR.toLocaleString()}/mo in MRR and $
              {currentMetrics.rebillingProfit.toLocaleString()}/mo in rebilling profit.
            </p>
            <p>
              <span className="font-semibold">Growth Trajectory:</span> With {growthMetrics.monthlyGrowthRate}% growth
              and {growthMetrics.monthlyChurnRate}% churn, you'll reach {finalMetrics.totalClients} clients and $
              {finalMetrics.MRR.toLocaleString()}/mo MRR in {growthMetrics.projectionPeriod} months.
            </p>
            <p>
              <span className="font-semibold">Profitability:</span> Your current profit margin is{' '}
              {currentMetrics.profitMargin.toFixed(1)}% with a net profit of $
              {currentMetrics.netProfit.toLocaleString()}/mo.
            </p>
            <p>
              <span className="font-semibold">Client Value:</span> Average client lifetime value is $
              {ltv.toLocaleString(undefined, { maximumFractionDigits: 0 })} over approximately{' '}
              {avgLifetimeMonths.toFixed(1)} months.
            </p>
            <p>
              <span className="font-semibold">CAC Breakeven:</span> To maintain profitability, keep customer
              acquisition costs below ${(ltv * 0.33).toLocaleString(undefined, { maximumFractionDigits: 0 })} per
              client (1/3 of LTV).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
