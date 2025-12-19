'use client';

import { useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import {
  BookOpen,
  Calculator,
  TrendingUp,
  Settings,
  DollarSign,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

type PlanType = 'starter' | 'unlimited' | 'pro';

interface PlanOption {
  id: PlanType;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  maxSubAccounts: number | null;
}

interface UsageEstimates {
  smsSegments: number;
  voiceMinutesOutbound: number;
  voiceMinutesInbound: number;
  emailsSent: number;
  localPhoneNumbers: number;
  tollFreeNumbers: number;
}

interface AddOns {
  aiEmployee: boolean;
  wordpressHosting: 'none' | 'basic' | 'standard' | 'premium';
  hipaaCompliance: boolean;
  whatsapp: boolean;
  onlineListings: boolean;
  dedicatedIP: boolean;
  a2pCampaigns: number;
}

const PLANS: PlanOption[] = [
  { id: 'starter', name: 'Starter', monthlyPrice: 97, annualPrice: 97 * 12 * 0.9, maxSubAccounts: 3 },
  { id: 'unlimited', name: 'Unlimited', monthlyPrice: 297, annualPrice: 297 * 12 * 0.9, maxSubAccounts: null },
  { id: 'pro', name: 'Pro', monthlyPrice: 497, annualPrice: 497 * 12 * 0.9, maxSubAccounts: null },
];

const USAGE_RATES = {
  smsPerSegment: 0.0083,
  smsCarrierFee: 0.003,
  voiceOutbound: 0.0166,
  voiceInbound: 0.01165,
  emailsPer1000: 0.675,
  localPhone: 1.15,
  tollFreePhone: 2.15,
};

const ADDON_PRICES = {
  aiEmployee: 97,
  wordpressBasic: 10,
  wordpressStandard: 220,
  wordpressPremium: 497,
  hipaa: 297,
  whatsapp: 10,
  onlineListings: 30,
  dedicatedIP: 59,
  a2pPerCampaign: 11.025,
};

// User Guide Component
function UserGuide() {
  const [isExpanded, setIsExpanded] = useState(true);

  const tabs = [
    {
      icon: <Calculator className="w-5 h-5 text-blue-600" />,
      title: "Agency Cost Calculator",
      description: "Start here! Calculate your total GoHighLevel costs including platform subscription, usage-based fees (SMS, calls, emails), and optional add-ons like AI Employee or HIPAA compliance.",
      tips: ["Select your plan tier", "Estimate your monthly usage", "Add any premium features you need"]
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-green-600" />,
      title: "SaaS Revenue Projector",
      description: "Model your SaaS business revenue by setting up client pricing tiers. Project growth over 12-24 months and see how rebilling services can boost your margins.",
      tips: ["Create up to 5 pricing tiers", "Set client counts per tier", "Adjust growth rate to model scenarios"]
    },
    {
      icon: <Settings className="w-5 h-5 text-purple-600" />,
      title: "Usage Cost Calculator",
      description: "Deep dive into usage-based pricing. Understand exactly what you'll pay for SMS, voice calls, emails, and AI services at different volume levels.",
      tips: ["See per-unit costs", "Compare LC Email tiers", "Calculate AI conversation costs"]
    },
    {
      icon: <DollarSign className="w-5 h-5 text-orange-600" />,
      title: "Rebilling Calculator",
      description: "Compare the $297 vs $497 plan for rebilling profitability. See how markup percentages affect your monthly profits and find your break-even point.",
      tips: ["Requires Pro ($497) plan for rebilling", "Adjust markup from 50% to 300%", "See break-even client count"]
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-indigo-600" />,
      title: "Profit Dashboard",
      description: "Comprehensive profit analysis with charts showing revenue vs costs, margin trends, and scenario comparisons (conservative, moderate, aggressive growth).",
      tips: ["View key metrics at a glance", "Compare growth scenarios", "Export data for presentations"]
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-8 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900">How to Use This Calculator</h2>
            <p className="text-sm text-gray-600">Quick guide to modeling your GoHighLevel costs and revenue</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6">
          {/* Quick Start */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-blue-100">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Quick Start Guide</h3>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li><strong>Calculate your costs</strong> using the Agency Cost Calculator below</li>
                  <li><strong>Set your pricing</strong> in the SaaS Revenue Projector tab</li>
                  <li><strong>Model rebilling profits</strong> if you&apos;re on the Pro plan</li>
                  <li><strong>Review your projections</strong> on the Profit Dashboard</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Tab Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tabs.map((tab, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  {tab.icon}
                  <h3 className="font-semibold text-gray-900 text-sm">{tab.title}</h3>
                </div>
                <p className="text-xs text-gray-600 mb-3">{tab.description}</p>
                <div className="space-y-1">
                  {tab.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <ArrowRight className="w-3 h-3 text-blue-400" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Model Overview */}
          <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">GoHighLevel Pricing Model Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900 mb-1">Starter - $97/mo</div>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  <li>• Up to 3 sub-accounts</li>
                  <li>• Basic CRM & automation</li>
                  <li>• Usage fees apply</li>
                </ul>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="font-medium text-blue-900 mb-1">Unlimited - $297/mo</div>
                <ul className="text-xs text-blue-700 space-y-0.5">
                  <li>• Unlimited sub-accounts</li>
                  <li>• All Starter features</li>
                  <li>• White-label capabilities</li>
                </ul>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="font-medium text-purple-900 mb-1">Pro (SaaS) - $497/mo</div>
                <ul className="text-xs text-purple-700 space-y-0.5">
                  <li>• Everything in Unlimited</li>
                  <li>• <strong>Rebilling markup</strong> capability</li>
                  <li>• SaaS mode & API access</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic">
              💡 Pro tip: The $497 Pro plan pays for itself if you can markup usage costs to clients. Even a 50% markup on $500/mo in usage = $250 extra profit!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AgencyCostCalculator() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('unlimited');
  const [isAnnual, setIsAnnual] = useState(false);
  const [subAccounts, setSubAccounts] = useState(1);
  const [usage, setUsage] = useState<UsageEstimates>({
    smsSegments: 0,
    voiceMinutesOutbound: 0,
    voiceMinutesInbound: 0,
    emailsSent: 0,
    localPhoneNumbers: 0,
    tollFreeNumbers: 0,
  });
  const [addOns, setAddOns] = useState<AddOns>({
    aiEmployee: false,
    wordpressHosting: 'none',
    hipaaCompliance: false,
    whatsapp: false,
    onlineListings: false,
    dedicatedIP: false,
    a2pCampaigns: 0,
  });

  const currentPlan = PLANS.find(p => p.id === selectedPlan)!;

  // Calculate costs
  const costs = useMemo(() => {
    // Platform cost
    const platformCost = isAnnual
      ? currentPlan.annualPrice / 12
      : currentPlan.monthlyPrice;

    // Usage costs
    const smsCost = usage.smsSegments * (USAGE_RATES.smsPerSegment + USAGE_RATES.smsCarrierFee);
    const voiceCost =
      (usage.voiceMinutesOutbound * USAGE_RATES.voiceOutbound) +
      (usage.voiceMinutesInbound * USAGE_RATES.voiceInbound);
    const emailCost = (usage.emailsSent / 1000) * USAGE_RATES.emailsPer1000;
    const phoneCost =
      (usage.localPhoneNumbers * USAGE_RATES.localPhone) +
      (usage.tollFreeNumbers * USAGE_RATES.tollFreePhone);

    const totalUsageCost = smsCost + voiceCost + emailCost + phoneCost;

    // Add-on costs
    const aiEmployeeCost = addOns.aiEmployee ? ADDON_PRICES.aiEmployee * subAccounts : 0;
    const wordpressCost =
      addOns.wordpressHosting === 'basic' ? ADDON_PRICES.wordpressBasic :
      addOns.wordpressHosting === 'standard' ? ADDON_PRICES.wordpressStandard :
      addOns.wordpressHosting === 'premium' ? ADDON_PRICES.wordpressPremium : 0;
    const hipaaCost = addOns.hipaaCompliance ? ADDON_PRICES.hipaa : 0;
    const whatsappCost = addOns.whatsapp ? ADDON_PRICES.whatsapp * subAccounts : 0;
    const onlineListingsCost = addOns.onlineListings ? ADDON_PRICES.onlineListings : 0;
    const dedicatedIPCost = addOns.dedicatedIP ? ADDON_PRICES.dedicatedIP : 0;
    const a2pCost = addOns.a2pCampaigns * ADDON_PRICES.a2pPerCampaign;

    const totalAddOnCost = aiEmployeeCost + wordpressCost + hipaaCost +
      whatsappCost + onlineListingsCost + dedicatedIPCost + a2pCost;

    const monthlyTotal = platformCost + totalUsageCost + totalAddOnCost;
    const annualTotal = monthlyTotal * 12;
    const annualSavings = isAnnual ? (currentPlan.monthlyPrice * 12 - currentPlan.annualPrice) : 0;

    return {
      platform: platformCost,
      usage: {
        sms: smsCost,
        voice: voiceCost,
        email: emailCost,
        phone: phoneCost,
        total: totalUsageCost,
      },
      addOns: {
        aiEmployee: aiEmployeeCost,
        wordpress: wordpressCost,
        hipaa: hipaaCost,
        whatsapp: whatsappCost,
        onlineListings: onlineListingsCost,
        dedicatedIP: dedicatedIPCost,
        a2p: a2pCost,
        total: totalAddOnCost,
      },
      monthlyTotal,
      annualTotal,
      annualSavings,
    };
  }, [selectedPlan, isAnnual, subAccounts, usage, addOns, currentPlan]);

  const handlePlanChange = (planId: PlanType) => {
    setSelectedPlan(planId);
    const plan = PLANS.find(p => p.id === planId)!;
    if (plan.maxSubAccounts && subAccounts > plan.maxSubAccounts) {
      setSubAccounts(plan.maxSubAccounts);
    }
    // Dedicated IP is Pro only
    if (planId !== 'pro' && addOns.dedicatedIP) {
      setAddOns(prev => ({ ...prev, dedicatedIP: false }));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* User Guide */}
      <UserGuide />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Agency Cost Calculator
        </h1>
        <p className="text-gray-600">
          Calculate your total GoHighLevel costs including platform fees, usage, and add-ons
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Selection</h2>

            {/* Annual Toggle */}
            <div className="mb-4 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Billing Frequency
              </span>
              <div className="flex items-center space-x-3">
                <span className={`text-sm ${!isAnnual ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isAnnual ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isAnnual ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm ${isAnnual ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                  Annual
                  <span className="ml-1 text-xs text-green-600">(Save 10%)</span>
                </span>
              </div>
            </div>

            {/* Plan Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handlePlanChange(plan.id)}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="absolute top-3 right-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === plan.id
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice)}
                    <span className="text-sm font-normal text-gray-500">/mo</span>
                  </div>
                  {plan.maxSubAccounts && (
                    <p className="text-xs text-gray-600">
                      Up to {plan.maxSubAccounts} sub-accounts
                    </p>
                  )}
                  {!plan.maxSubAccounts && (
                    <p className="text-xs text-gray-600">Unlimited sub-accounts</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sub-Accounts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sub-Accounts</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Number of Sub-Accounts
                {currentPlan.maxSubAccounts && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Max: {currentPlan.maxSubAccounts})
                  </span>
                )}
              </label>
              <input
                type="number"
                min="1"
                max={currentPlan.maxSubAccounts || undefined}
                value={subAccounts}
                onChange={(e) => setSubAccounts(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Usage Estimates */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Usage Estimates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SMS Segments
                  <span className="ml-1 text-xs text-gray-500">
                    (${(USAGE_RATES.smsPerSegment + USAGE_RATES.smsCarrierFee).toFixed(4)}/segment)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={usage.smsSegments}
                  onChange={(e) => setUsage(prev => ({ ...prev, smsSegments: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Outbound Voice Minutes
                  <span className="ml-1 text-xs text-gray-500">
                    (${USAGE_RATES.voiceOutbound}/min)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={usage.voiceMinutesOutbound}
                  onChange={(e) => setUsage(prev => ({ ...prev, voiceMinutesOutbound: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inbound Voice Minutes
                  <span className="ml-1 text-xs text-gray-500">
                    (${USAGE_RATES.voiceInbound}/min)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={usage.voiceMinutesInbound}
                  onChange={(e) => setUsage(prev => ({ ...prev, voiceMinutesInbound: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emails Sent
                  <span className="ml-1 text-xs text-gray-500">
                    (${USAGE_RATES.emailsPer1000}/1000)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={usage.emailsSent}
                  onChange={(e) => setUsage(prev => ({ ...prev, emailsSent: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local Phone Numbers
                  <span className="ml-1 text-xs text-gray-500">
                    (${USAGE_RATES.localPhone}/number)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={usage.localPhoneNumbers}
                  onChange={(e) => setUsage(prev => ({ ...prev, localPhoneNumbers: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Toll-Free Numbers
                  <span className="ml-1 text-xs text-gray-500">
                    (${USAGE_RATES.tollFreePhone}/number)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={usage.tollFreeNumbers}
                  onChange={(e) => setUsage(prev => ({ ...prev, tollFreeNumbers: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Add-Ons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add-Ons</h2>
            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addOns.aiEmployee}
                  onChange={(e) => setAddOns(prev => ({ ...prev, aiEmployee: e.target.checked }))}
                  className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">AI Employee Unlimited</div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(ADDON_PRICES.aiEmployee)}/sub-account/month
                    {addOns.aiEmployee && (
                      <span className="ml-2 font-semibold text-blue-600">
                        ({formatCurrency(ADDON_PRICES.aiEmployee * subAccounts)}/mo total)
                      </span>
                    )}
                  </div>
                </div>
              </label>

              <div className="space-y-2">
                <label className="block font-medium text-gray-900">WordPress Hosting</label>
                <select
                  value={addOns.wordpressHosting}
                  onChange={(e) => setAddOns(prev => ({ ...prev, wordpressHosting: e.target.value as AddOns['wordpressHosting'] }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">None</option>
                  <option value="basic">Basic - {formatCurrency(ADDON_PRICES.wordpressBasic)}/mo</option>
                  <option value="standard">Standard - {formatCurrency(ADDON_PRICES.wordpressStandard)}/mo</option>
                  <option value="premium">Premium - {formatCurrency(ADDON_PRICES.wordpressPremium)}/mo</option>
                </select>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addOns.hipaaCompliance}
                  onChange={(e) => setAddOns(prev => ({ ...prev, hipaaCompliance: e.target.checked }))}
                  className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">HIPAA Compliance</div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(ADDON_PRICES.hipaa)}/month
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addOns.whatsapp}
                  onChange={(e) => setAddOns(prev => ({ ...prev, whatsapp: e.target.checked }))}
                  className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">WhatsApp</div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(ADDON_PRICES.whatsapp)}/sub-account/month
                    {addOns.whatsapp && (
                      <span className="ml-2 font-semibold text-blue-600">
                        ({formatCurrency(ADDON_PRICES.whatsapp * subAccounts)}/mo total)
                      </span>
                    )}
                  </div>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addOns.onlineListings}
                  onChange={(e) => setAddOns(prev => ({ ...prev, onlineListings: e.target.checked }))}
                  className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Online Listings</div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(ADDON_PRICES.onlineListings)}/month
                  </div>
                </div>
              </label>

              <label className={`flex items-start space-x-3 ${selectedPlan !== 'pro' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={addOns.dedicatedIP}
                  onChange={(e) => setAddOns(prev => ({ ...prev, dedicatedIP: e.target.checked }))}
                  disabled={selectedPlan !== 'pro'}
                  className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    Dedicated IP
                    {selectedPlan !== 'pro' && (
                      <span className="ml-2 text-xs text-orange-600">(Pro plan only)</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(ADDON_PRICES.dedicatedIP)}/month
                  </div>
                </div>
              </label>

              <div className="space-y-2">
                <label className="block font-medium text-gray-900">
                  A2P Registration Campaigns
                  <span className="ml-1 text-xs text-gray-500">
                    ({formatCurrency(ADDON_PRICES.a2pPerCampaign)}/campaign/month)
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={addOns.a2pCampaigns}
                  onChange={(e) => setAddOns(prev => ({ ...prev, a2pCampaigns: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cost Summary</h2>

            <div className="space-y-4">
              {/* Platform Cost */}
              <div className="pb-3 border-b border-gray-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Platform Cost</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(costs.platform)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {currentPlan.name} Plan {isAnnual && '(Annual)'}
                </div>
              </div>

              {/* Usage Costs */}
              {costs.usage.total > 0 && (
                <div className="pb-3 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Usage Costs</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(costs.usage.total)}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    {costs.usage.sms > 0 && (
                      <div className="flex justify-between">
                        <span>SMS</span>
                        <span>{formatCurrency(costs.usage.sms)}</span>
                      </div>
                    )}
                    {costs.usage.voice > 0 && (
                      <div className="flex justify-between">
                        <span>Voice</span>
                        <span>{formatCurrency(costs.usage.voice)}</span>
                      </div>
                    )}
                    {costs.usage.email > 0 && (
                      <div className="flex justify-between">
                        <span>Email</span>
                        <span>{formatCurrency(costs.usage.email)}</span>
                      </div>
                    )}
                    {costs.usage.phone > 0 && (
                      <div className="flex justify-between">
                        <span>Phone Numbers</span>
                        <span>{formatCurrency(costs.usage.phone)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Add-On Costs */}
              {costs.addOns.total > 0 && (
                <div className="pb-3 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Add-Ons</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(costs.addOns.total)}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    {costs.addOns.aiEmployee > 0 && (
                      <div className="flex justify-between">
                        <span>AI Employee</span>
                        <span>{formatCurrency(costs.addOns.aiEmployee)}</span>
                      </div>
                    )}
                    {costs.addOns.wordpress > 0 && (
                      <div className="flex justify-between">
                        <span>WordPress</span>
                        <span>{formatCurrency(costs.addOns.wordpress)}</span>
                      </div>
                    )}
                    {costs.addOns.hipaa > 0 && (
                      <div className="flex justify-between">
                        <span>HIPAA</span>
                        <span>{formatCurrency(costs.addOns.hipaa)}</span>
                      </div>
                    )}
                    {costs.addOns.whatsapp > 0 && (
                      <div className="flex justify-between">
                        <span>WhatsApp</span>
                        <span>{formatCurrency(costs.addOns.whatsapp)}</span>
                      </div>
                    )}
                    {costs.addOns.onlineListings > 0 && (
                      <div className="flex justify-between">
                        <span>Online Listings</span>
                        <span>{formatCurrency(costs.addOns.onlineListings)}</span>
                      </div>
                    )}
                    {costs.addOns.dedicatedIP > 0 && (
                      <div className="flex justify-between">
                        <span>Dedicated IP</span>
                        <span>{formatCurrency(costs.addOns.dedicatedIP)}</span>
                      </div>
                    )}
                    {costs.addOns.a2p > 0 && (
                      <div className="flex justify-between">
                        <span>A2P Registration</span>
                        <span>{formatCurrency(costs.addOns.a2p)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Total Monthly */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-base font-semibold text-gray-900">Monthly Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(costs.monthlyTotal)}
                  </span>
                </div>

                {/* Annual Cost */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Annual Cost</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(costs.annualTotal)}
                    </span>
                  </div>
                  {isAnnual && costs.annualSavings > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="text-sm font-medium">Annual Savings</span>
                      <span className="text-sm font-semibold">
                        {formatCurrency(costs.annualSavings)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
