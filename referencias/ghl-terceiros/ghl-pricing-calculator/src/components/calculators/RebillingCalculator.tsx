"use client";

import React, { useState, useMemo } from 'react';

interface ServiceConfig {
  volume: number;
  markup: number;
}

interface RebillingCalculatorProps {
  className?: string;
}

export default function RebillingCalculator({ className = '' }: RebillingCalculatorProps) {
  const [numClients, setNumClients] = useState(10);
  const [planType, setPlanType] = useState<'297' | '497'>('497');

  // Phone/SMS Configuration
  const [smsConfig, setSmsConfig] = useState<ServiceConfig>({
    volume: 1000, // SMS segments per client per month
    markup: 100, // 100% markup
  });

  // Email Configuration
  const [emailConfig, setEmailConfig] = useState<ServiceConfig>({
    volume: 5000, // emails per client per month
    markup: 150,
  });

  // AI Services Configuration
  const [conversationAI, setConversationAI] = useState<ServiceConfig>({
    volume: 500, // messages per client per month
    markup: 200,
  });

  const [voiceAI, setVoiceAI] = useState<ServiceConfig>({
    volume: 100, // minutes per client per month
    markup: 150,
  });

  const [reviewsAI, setReviewsAI] = useState<ServiceConfig>({
    volume: 50, // reviews per client per month
    markup: 300,
  });

  const [contentAI, setContentAI] = useState<ServiceConfig>({
    volume: 10000, // words per client per month
    markup: 200,
  });

  // Premium Workflows Configuration
  const [workflowsConfig, setWorkflowsConfig] = useState<ServiceConfig>({
    volume: 2000, // executions per client per month
    markup: 100,
  });

  // WordPress Hosting Configuration
  const [wpHosting, setWpHosting] = useState({
    sitesPerClient: 1,
    yourCost: 10,
    clientPrice: 25,
  });

  // Base costs (per unit)
  const baseCosts = {
    sms: 0.0083,
    smsCarrierFee: 0.003,
    email: 0.675 / 1000, // per email
    conversationAI: 0.02,
    voiceAI: 0.06,
    reviewsAI: 0.01,
    contentAI: 0.0945 / 1000, // per word
    workflow: 0.01,
  };

  // Calculate effective markup (0% for $297 plan, configured for $497 plan)
  const getEffectiveMarkup = (configuredMarkup: number) => {
    return planType === '297' ? 0 : configuredMarkup;
  };

  // Calculate per-service metrics
  const calculations = useMemo(() => {
    const totalSmsCost = baseCosts.sms + baseCosts.smsCarrierFee;
    const effectiveSmsMarkup = getEffectiveMarkup(smsConfig.markup);
    const smsClientPrice = totalSmsCost * (1 + effectiveSmsMarkup / 100);
    const smsMonthlyCost = totalSmsCost * smsConfig.volume * numClients;
    const smsMonthlyRevenue = smsClientPrice * smsConfig.volume * numClients;
    const smsMonthlyProfit = smsMonthlyRevenue - smsMonthlyCost;

    const effectiveEmailMarkup = getEffectiveMarkup(emailConfig.markup);
    const emailClientPrice = baseCosts.email * (1 + effectiveEmailMarkup / 100);
    const emailMonthlyCost = baseCosts.email * emailConfig.volume * numClients;
    const emailMonthlyRevenue = emailClientPrice * emailConfig.volume * numClients;
    const emailMonthlyProfit = emailMonthlyRevenue - emailMonthlyCost;

    const effectiveConvAIMarkup = getEffectiveMarkup(conversationAI.markup);
    const convAIClientPrice = baseCosts.conversationAI * (1 + effectiveConvAIMarkup / 100);
    const convAIMonthlyCost = baseCosts.conversationAI * conversationAI.volume * numClients;
    const convAIMonthlyRevenue = convAIClientPrice * conversationAI.volume * numClients;
    const convAIMonthlyProfit = convAIMonthlyRevenue - convAIMonthlyCost;

    const effectiveVoiceAIMarkup = getEffectiveMarkup(voiceAI.markup);
    const voiceAIClientPrice = baseCosts.voiceAI * (1 + effectiveVoiceAIMarkup / 100);
    const voiceAIMonthlyCost = baseCosts.voiceAI * voiceAI.volume * numClients;
    const voiceAIMonthlyRevenue = voiceAIClientPrice * voiceAI.volume * numClients;
    const voiceAIMonthlyProfit = voiceAIMonthlyRevenue - voiceAIMonthlyCost;

    const effectiveReviewsAIMarkup = getEffectiveMarkup(reviewsAI.markup);
    const reviewsAIClientPrice = baseCosts.reviewsAI * (1 + effectiveReviewsAIMarkup / 100);
    const reviewsAIMonthlyCost = baseCosts.reviewsAI * reviewsAI.volume * numClients;
    const reviewsAIMonthlyRevenue = reviewsAIClientPrice * reviewsAI.volume * numClients;
    const reviewsAIMonthlyProfit = reviewsAIMonthlyRevenue - reviewsAIMonthlyCost;

    const effectiveContentAIMarkup = getEffectiveMarkup(contentAI.markup);
    const contentAIClientPrice = baseCosts.contentAI * (1 + effectiveContentAIMarkup / 100);
    const contentAIMonthlyCost = baseCosts.contentAI * contentAI.volume * numClients;
    const contentAIMonthlyRevenue = contentAIClientPrice * contentAI.volume * numClients;
    const contentAIMonthlyProfit = contentAIMonthlyRevenue - contentAIMonthlyCost;

    const effectiveWorkflowMarkup = getEffectiveMarkup(workflowsConfig.markup);
    const workflowClientPrice = baseCosts.workflow * (1 + effectiveWorkflowMarkup / 100);
    const workflowMonthlyCost = baseCosts.workflow * workflowsConfig.volume * numClients;
    const workflowMonthlyRevenue = workflowClientPrice * workflowsConfig.volume * numClients;
    const workflowMonthlyProfit = workflowMonthlyRevenue - workflowMonthlyCost;

    const totalWpSites = wpHosting.sitesPerClient * numClients;
    const wpMonthlyCost = wpHosting.yourCost * totalWpSites;
    const wpMonthlyRevenue = wpHosting.clientPrice * totalWpSites;
    const wpMonthlyProfit = wpMonthlyRevenue - wpMonthlyCost;

    const totalMonthlyCost = smsMonthlyCost + emailMonthlyCost + convAIMonthlyCost +
                             voiceAIMonthlyCost + reviewsAIMonthlyCost + contentAIMonthlyCost +
                             workflowMonthlyCost + wpMonthlyCost;
    const totalMonthlyRevenue = smsMonthlyRevenue + emailMonthlyRevenue + convAIMonthlyRevenue +
                                voiceAIMonthlyRevenue + reviewsAIMonthlyRevenue + contentAIMonthlyRevenue +
                                workflowMonthlyRevenue + wpMonthlyRevenue;
    const totalMonthlyProfit = totalMonthlyRevenue - totalMonthlyCost;
    const totalAnnualProfit = totalMonthlyProfit * 12;
    const profitPerClient = numClients > 0 ? totalMonthlyProfit / numClients : 0;

    return {
      sms: {
        costPerUnit: totalSmsCost,
        clientPricePerUnit: smsClientPrice,
        monthlyVolume: smsConfig.volume * numClients,
        monthlyCost: smsMonthlyCost,
        monthlyRevenue: smsMonthlyRevenue,
        monthlyProfit: smsMonthlyProfit,
      },
      email: {
        costPerUnit: baseCosts.email,
        clientPricePerUnit: emailClientPrice,
        monthlyVolume: emailConfig.volume * numClients,
        monthlyCost: emailMonthlyCost,
        monthlyRevenue: emailMonthlyRevenue,
        monthlyProfit: emailMonthlyProfit,
      },
      conversationAI: {
        costPerUnit: baseCosts.conversationAI,
        clientPricePerUnit: convAIClientPrice,
        monthlyVolume: conversationAI.volume * numClients,
        monthlyCost: convAIMonthlyCost,
        monthlyRevenue: convAIMonthlyRevenue,
        monthlyProfit: convAIMonthlyProfit,
      },
      voiceAI: {
        costPerUnit: baseCosts.voiceAI,
        clientPricePerUnit: voiceAIClientPrice,
        monthlyVolume: voiceAI.volume * numClients,
        monthlyCost: voiceAIMonthlyCost,
        monthlyRevenue: voiceAIMonthlyRevenue,
        monthlyProfit: voiceAIMonthlyProfit,
      },
      reviewsAI: {
        costPerUnit: baseCosts.reviewsAI,
        clientPricePerUnit: reviewsAIClientPrice,
        monthlyVolume: reviewsAI.volume * numClients,
        monthlyCost: reviewsAIMonthlyCost,
        monthlyRevenue: reviewsAIMonthlyRevenue,
        monthlyProfit: reviewsAIMonthlyProfit,
      },
      contentAI: {
        costPerUnit: baseCosts.contentAI,
        clientPricePerUnit: contentAIClientPrice,
        monthlyVolume: contentAI.volume * numClients,
        monthlyCost: contentAIMonthlyCost,
        monthlyRevenue: contentAIMonthlyRevenue,
        monthlyProfit: contentAIMonthlyProfit,
      },
      workflows: {
        costPerUnit: baseCosts.workflow,
        clientPricePerUnit: workflowClientPrice,
        monthlyVolume: workflowsConfig.volume * numClients,
        monthlyCost: workflowMonthlyCost,
        monthlyRevenue: workflowMonthlyRevenue,
        monthlyProfit: workflowMonthlyProfit,
      },
      wpHosting: {
        costPerSite: wpHosting.yourCost,
        clientPricePerSite: wpHosting.clientPrice,
        totalSites: totalWpSites,
        monthlyCost: wpMonthlyCost,
        monthlyRevenue: wpMonthlyRevenue,
        monthlyProfit: wpMonthlyProfit,
      },
      totals: {
        monthlyCost: totalMonthlyCost,
        monthlyRevenue: totalMonthlyRevenue,
        monthlyProfit: totalMonthlyProfit,
        annualProfit: totalAnnualProfit,
        profitPerClient: profitPerClient,
      },
    };
  }, [
    numClients, planType, smsConfig, emailConfig, conversationAI, voiceAI,
    reviewsAI, contentAI, workflowsConfig, wpHosting, baseCosts
  ]);

  // Break-even analysis: How much additional profit needed to justify $497 plan
  const breakEvenAnalysis = useMemo(() => {
    const planDifference = 200; // $497 - $297
    const currentProfit = calculations.totals.monthlyProfit;

    // Calculate profit with $297 plan (no markup)
    const profit297 = calculations.wpHosting.monthlyProfit; // Only WP hosting has profit on $297

    // Additional profit from $497 plan
    const additionalProfit = currentProfit - profit297;

    // Months to break even
    const monthsToBreakEven = additionalProfit > 0 ? planDifference / additionalProfit : Infinity;

    return {
      planDifference,
      profit297,
      profit497: currentProfit,
      additionalProfit,
      monthsToBreakEven,
      isWorthIt: monthsToBreakEven <= 12,
    };
  }, [calculations]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Rebilling Markup Calculator
        </h2>
        <p className="text-gray-600">
          Calculate your profit from rebilling GHL services to clients
        </p>
      </div>

      {/* Plan Selection */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select Your GHL Plan:
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setPlanType('297')}
            className={`p-4 rounded-lg border-2 transition-all ${
              planType === '297'
                ? 'border-blue-500 bg-blue-100 shadow-md'
                : 'border-gray-300 bg-white hover:border-blue-300'
            }`}
          >
            <div className="text-lg font-bold text-gray-900">$297 Plan</div>
            <div className="text-sm text-gray-600 mt-1">Rebill at cost only (no markup)</div>
          </button>
          <button
            onClick={() => setPlanType('497')}
            className={`p-4 rounded-lg border-2 transition-all ${
              planType === '497'
                ? 'border-green-500 bg-green-100 shadow-md'
                : 'border-gray-300 bg-white hover:border-green-300'
            }`}
          >
            <div className="text-lg font-bold text-gray-900">$497 Plan</div>
            <div className="text-sm text-gray-600 mt-1">SaaS mode with custom markup</div>
          </button>
        </div>
      </div>

      {/* Number of Clients */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Number of Clients: {numClients}
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={numClients}
          onChange={(e) => setNumClients(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1</span>
          <span>100</span>
        </div>
      </div>

      {/* Phone/SMS Rebilling */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Phone/SMS Rebilling
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMS Segments per Client/Month: {formatNumber(smsConfig.volume)}
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={smsConfig.volume}
              onChange={(e) => setSmsConfig({ ...smsConfig, volume: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>10,000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Markup: {getEffectiveMarkup(smsConfig.markup)}%
              {planType === '297' && <span className="text-red-600 ml-2">(No markup on $297 plan)</span>}
            </label>
            <input
              type="range"
              min="0"
              max="300"
              step="10"
              value={smsConfig.markup}
              onChange={(e) => setSmsConfig({ ...smsConfig, markup: Number(e.target.value) })}
              disabled={planType === '297'}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>300%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Your Cost/SMS</div>
            <div className="font-semibold text-gray-900">
              {formatCurrency(calculations.sms.costPerUnit)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Client Price/SMS</div>
            <div className="font-semibold text-gray-900">
              {formatCurrency(calculations.sms.clientPricePerUnit)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Monthly Volume</div>
            <div className="font-semibold text-gray-900">
              {formatNumber(calculations.sms.monthlyVolume)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Monthly Profit</div>
            <div className="font-semibold text-green-600">
              {formatCurrency(calculations.sms.monthlyProfit)}
            </div>
          </div>
        </div>
      </div>

      {/* Email Rebilling */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Email Rebilling
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emails per Client/Month: {formatNumber(emailConfig.volume)}
            </label>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={emailConfig.volume}
              onChange={(e) => setEmailConfig({ ...emailConfig, volume: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>50,000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Markup: {getEffectiveMarkup(emailConfig.markup)}%
              {planType === '297' && <span className="text-red-600 ml-2">(No markup on $297 plan)</span>}
            </label>
            <input
              type="range"
              min="0"
              max="300"
              step="10"
              value={emailConfig.markup}
              onChange={(e) => setEmailConfig({ ...emailConfig, markup: Number(e.target.value) })}
              disabled={planType === '297'}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>300%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Your Cost/Email</div>
            <div className="font-semibold text-gray-900">
              {formatCurrency(calculations.email.costPerUnit)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Client Price/Email</div>
            <div className="font-semibold text-gray-900">
              {formatCurrency(calculations.email.clientPricePerUnit)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Monthly Volume</div>
            <div className="font-semibold text-gray-900">
              {formatNumber(calculations.email.monthlyVolume)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Monthly Profit</div>
            <div className="font-semibold text-green-600">
              {formatCurrency(calculations.email.monthlyProfit)}
            </div>
          </div>
        </div>
      </div>

      {/* AI Services */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          AI Services Rebilling
        </h3>

        {/* Conversation AI */}
        <div className="mb-4 p-3 bg-white rounded border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Conversation AI</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Messages per Client/Month: {formatNumber(conversationAI.volume)}
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={conversationAI.volume}
                onChange={(e) => setConversationAI({ ...conversationAI, volume: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Markup: {getEffectiveMarkup(conversationAI.markup)}%
              </label>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={conversationAI.markup}
                onChange={(e) => setConversationAI({ ...conversationAI, markup: Number(e.target.value) })}
                disabled={planType === '297'}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-gray-600">Cost/Msg</div>
              <div className="font-semibold">{formatCurrency(calculations.conversationAI.costPerUnit)}</div>
            </div>
            <div>
              <div className="text-gray-600">Client Price</div>
              <div className="font-semibold">{formatCurrency(calculations.conversationAI.clientPricePerUnit)}</div>
            </div>
            <div>
              <div className="text-gray-600">Volume</div>
              <div className="font-semibold">{formatNumber(calculations.conversationAI.monthlyVolume)}</div>
            </div>
            <div>
              <div className="text-gray-600">Profit</div>
              <div className="font-semibold text-green-600">{formatCurrency(calculations.conversationAI.monthlyProfit)}</div>
            </div>
          </div>
        </div>

        {/* Voice AI */}
        <div className="mb-4 p-3 bg-white rounded border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Voice AI</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minutes per Client/Month: {formatNumber(voiceAI.volume)}
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={voiceAI.volume}
                onChange={(e) => setVoiceAI({ ...voiceAI, volume: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Markup: {getEffectiveMarkup(voiceAI.markup)}%
              </label>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={voiceAI.markup}
                onChange={(e) => setVoiceAI({ ...voiceAI, markup: Number(e.target.value) })}
                disabled={planType === '297'}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-gray-600">Cost/Min</div>
              <div className="font-semibold">{formatCurrency(calculations.voiceAI.costPerUnit)}</div>
            </div>
            <div>
              <div className="text-gray-600">Client Price</div>
              <div className="font-semibold">{formatCurrency(calculations.voiceAI.clientPricePerUnit)}</div>
            </div>
            <div>
              <div className="text-gray-600">Volume</div>
              <div className="font-semibold">{formatNumber(calculations.voiceAI.monthlyVolume)}</div>
            </div>
            <div>
              <div className="text-gray-600">Profit</div>
              <div className="font-semibold text-green-600">{formatCurrency(calculations.voiceAI.monthlyProfit)}</div>
            </div>
          </div>
        </div>

        {/* Reviews AI */}
        <div className="mb-4 p-3 bg-white rounded border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Reviews AI</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reviews per Client/Month: {formatNumber(reviewsAI.volume)}
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={reviewsAI.volume}
                onChange={(e) => setReviewsAI({ ...reviewsAI, volume: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Markup: {getEffectiveMarkup(reviewsAI.markup)}%
              </label>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={reviewsAI.markup}
                onChange={(e) => setReviewsAI({ ...reviewsAI, markup: Number(e.target.value) })}
                disabled={planType === '297'}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-gray-600">Cost/Review</div>
              <div className="font-semibold">{formatCurrency(calculations.reviewsAI.costPerUnit)}</div>
            </div>
            <div>
              <div className="text-gray-600">Client Price</div>
              <div className="font-semibold">{formatCurrency(calculations.reviewsAI.clientPricePerUnit)}</div>
            </div>
            <div>
              <div className="text-gray-600">Volume</div>
              <div className="font-semibold">{formatNumber(calculations.reviewsAI.monthlyVolume)}</div>
            </div>
            <div>
              <div className="text-gray-600">Profit</div>
              <div className="font-semibold text-green-600">{formatCurrency(calculations.reviewsAI.monthlyProfit)}</div>
            </div>
          </div>
        </div>

        {/* Content AI */}
        <div className="p-3 bg-white rounded border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Content AI</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Words per Client/Month: {formatNumber(contentAI.volume)}
              </label>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={contentAI.volume}
                onChange={(e) => setContentAI({ ...contentAI, volume: Number(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Markup: {getEffectiveMarkup(contentAI.markup)}%
              </label>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={contentAI.markup}
                onChange={(e) => setContentAI({ ...contentAI, markup: Number(e.target.value) })}
                disabled={planType === '297'}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-gray-600">Cost/Word</div>
              <div className="font-semibold">{formatCurrency(calculations.contentAI.costPerUnit)}</div>
            </div>
            <div>
              <div className="text-gray-600">Client Price</div>
              <div className="font-semibold">{formatCurrency(calculations.contentAI.clientPricePerUnit)}</div>
            </div>
            <div>
              <div className="text-gray-600">Volume</div>
              <div className="font-semibold">{formatNumber(calculations.contentAI.monthlyVolume)}</div>
            </div>
            <div>
              <div className="text-gray-600">Profit</div>
              <div className="font-semibold text-green-600">{formatCurrency(calculations.contentAI.monthlyProfit)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Workflows */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Premium Workflows
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Executions per Client/Month: {formatNumber(workflowsConfig.volume)}
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={workflowsConfig.volume}
              onChange={(e) => setWorkflowsConfig({ ...workflowsConfig, volume: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>10,000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Markup: {getEffectiveMarkup(workflowsConfig.markup)}%
            </label>
            <input
              type="range"
              min="0"
              max="300"
              step="10"
              value={workflowsConfig.markup}
              onChange={(e) => setWorkflowsConfig({ ...workflowsConfig, markup: Number(e.target.value) })}
              disabled={planType === '297'}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>300%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Your Cost/Exec</div>
            <div className="font-semibold text-gray-900">
              {formatCurrency(calculations.workflows.costPerUnit)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Client Price/Exec</div>
            <div className="font-semibold text-gray-900">
              {formatCurrency(calculations.workflows.clientPricePerUnit)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Monthly Volume</div>
            <div className="font-semibold text-gray-900">
              {formatNumber(calculations.workflows.monthlyVolume)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Monthly Profit</div>
            <div className="font-semibold text-green-600">
              {formatCurrency(calculations.workflows.monthlyProfit)}
            </div>
          </div>
        </div>
      </div>

      {/* WordPress Hosting */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          WordPress Hosting (Reselling)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sites per Client: {wpHosting.sitesPerClient}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={wpHosting.sitesPerClient}
              onChange={(e) => setWpHosting({ ...wpHosting, sitesPerClient: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>10</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Cost per Site
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={wpHosting.yourCost}
              onChange={(e) => setWpHosting({ ...wpHosting, yourCost: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Price per Site
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={wpHosting.clientPrice}
              onChange={(e) => setWpHosting({ ...wpHosting, clientPrice: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Your Cost/Site</div>
            <div className="font-semibold text-gray-900">
              {formatCurrency(calculations.wpHosting.costPerSite)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Client Price/Site</div>
            <div className="font-semibold text-gray-900">
              {formatCurrency(calculations.wpHosting.clientPricePerSite)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Total Sites</div>
            <div className="font-semibold text-gray-900">
              {calculations.wpHosting.totalSites}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Monthly Profit</div>
            <div className="font-semibold text-green-600">
              {formatCurrency(calculations.wpHosting.monthlyProfit)}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mb-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Rebilling Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Total Monthly Revenue</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(calculations.totals.monthlyRevenue)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Total Monthly Costs</div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(calculations.totals.monthlyCost)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Total Monthly Profit</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(calculations.totals.monthlyProfit)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Annual Profit</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(calculations.totals.annualProfit)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Profit per Client</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(calculations.totals.profitPerClient)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-600 mb-1">Selected Plan</div>
            <div className="text-2xl font-bold text-gray-900">
              ${planType}
            </div>
          </div>
        </div>
      </div>

      {/* Break-even Analysis */}
      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Break-Even Analysis: $297 vs $497 Plan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-lg font-semibold text-gray-900 mb-2">$297 Plan (No Markup)</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Profit:</span>
                <span className="font-semibold">{formatCurrency(breakEvenAnalysis.profit297)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Profit:</span>
                <span className="font-semibold">{formatCurrency(breakEvenAnalysis.profit297 * 12)}</span>
              </div>
              <div className="mt-3 p-2 bg-gray-100 rounded text-xs text-gray-700">
                Only WordPress hosting generates profit on this plan
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-lg font-semibold text-gray-900 mb-2">$497 Plan (With Markup)</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Profit:</span>
                <span className="font-semibold text-green-600">{formatCurrency(breakEvenAnalysis.profit497)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual Profit:</span>
                <span className="font-semibold text-green-600">{formatCurrency(breakEvenAnalysis.profit497 * 12)}</span>
              </div>
              <div className="mt-3 p-2 bg-green-100 rounded text-xs text-gray-700">
                Additional profit from markup capabilities
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Plan Cost Difference:</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(breakEvenAnalysis.planDifference)}/month
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Additional Monthly Profit from $497:</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(breakEvenAnalysis.additionalProfit)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-gray-700 font-medium">Months to Break Even:</span>
              <span className="text-xl font-bold text-purple-600">
                {breakEvenAnalysis.monthsToBreakEven === Infinity
                  ? 'Never'
                  : breakEvenAnalysis.monthsToBreakEven.toFixed(1)}
              </span>
            </div>

            <div className={`mt-4 p-4 rounded-lg ${
              breakEvenAnalysis.isWorthIt
                ? 'bg-green-100 border border-green-300'
                : 'bg-yellow-100 border border-yellow-300'
            }`}>
              <div className="font-semibold text-gray-900 mb-1">
                {breakEvenAnalysis.isWorthIt ? 'Recommendation: $497 Plan' : 'Recommendation: $297 Plan'}
              </div>
              <div className="text-sm text-gray-700">
                {breakEvenAnalysis.isWorthIt
                  ? `The $497 plan will pay for itself in ${breakEvenAnalysis.monthsToBreakEven.toFixed(1)} months and generate ${formatCurrency(breakEvenAnalysis.additionalProfit * 12)} more profit annually.`
                  : breakEvenAnalysis.additionalProfit > 0
                    ? `The $497 plan takes ${breakEvenAnalysis.monthsToBreakEven.toFixed(1)} months to break even. Consider increasing client volume or markup percentages.`
                    : 'With current settings, increase client volume or markup percentages to make the $497 plan worthwhile.'
                }
              </div>
            </div>
          </div>
        </div>

        {!breakEvenAnalysis.isWorthIt && breakEvenAnalysis.additionalProfit > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-semibold text-gray-900 mb-2">To Break Even in 12 Months:</div>
            <div className="text-sm text-gray-700">
              You need an additional {formatCurrency((breakEvenAnalysis.planDifference - breakEvenAnalysis.additionalProfit))}
              in monthly profit. Try:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Increase markup percentages</li>
                <li>Add {Math.ceil((breakEvenAnalysis.planDifference - breakEvenAnalysis.additionalProfit) / (calculations.totals.profitPerClient || 1))} more clients</li>
                <li>Increase service volume per client</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
