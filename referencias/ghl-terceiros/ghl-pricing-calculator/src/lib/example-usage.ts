/**
 * Example Usage of Utility and Calculation Functions
 *
 * This file demonstrates how to use the utility and calculation functions
 * in your GoHighLevel pricing calculator components.
 */

import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  calculateMonthlyFromAnnual,
  calculateAnnualSavings,
} from "./utils";

import {
  calculateAgencyCost,
  calculateClientRevenue,
  calculateUsageCost,
  calculateRebillingProfit,
  calculateSaaSRevenue,
  calculateProfitMargin,
  calculateBreakeven,
  projectRevenueGrowth,
  calculateCustomerLifetimeValue,
  calculateCACPaybackPeriod,
  calculateROI,
  calculateVolumeDiscountPrice,
  calculateACV,
  calculateChurnRate,
  type AgencyPlan,
  type UsageEstimate,
  type AddOn,
  type UsageService,
  type SaaSTier,
} from "./calculations";

// ============================================================================
// EXAMPLE 1: Formatting Functions
// ============================================================================

export function exampleFormatting() {
  console.log("=== Formatting Examples ===");

  // Currency formatting
  console.log(formatCurrency(1234.56)); // "$1,234.56"
  console.log(formatCurrency(99.9)); // "$99.90"

  // Number formatting
  console.log(formatNumber(1234567.89)); // "1,234,567.89"
  console.log(formatNumber(42)); // "42"

  // Percentage formatting
  console.log(formatPercentage(0.156)); // "15.6%"
  console.log(formatPercentage(0.156, 0)); // "16%"
  console.log(formatPercentage(0.156, 2)); // "15.60%"

  // Annual/Monthly conversions
  const annual = 2988;
  const monthly = 297;
  console.log(formatCurrency(calculateMonthlyFromAnnual(annual))); // "$249.00"
  console.log(formatCurrency(calculateAnnualSavings(monthly, annual))); // "$576.00"
}

// ============================================================================
// EXAMPLE 2: Agency Cost Calculation
// ============================================================================

export function exampleAgencyCost() {
  console.log("\n=== Agency Cost Calculation ===");

  // Define an agency plan
  const plan: AgencyPlan = {
    name: "Agency Pro",
    monthlyPrice: 297,
    annualPrice: 2988,
    includedAccounts: 3,
    additionalAccountPrice: 97,
  };

  // Define usage estimates
  const usage: UsageEstimate = {
    emails: 50000,
    sms: 1000,
    calls: 500,
    aiAgentMinutes: 100,
  };

  // Define add-ons
  const addOns: AddOn[] = [
    { name: "White Label", price: 497, billingCycle: "monthly" },
    { name: "Advanced Reporting", price: 97, billingCycle: "monthly" },
  ];

  // Calculate monthly cost
  const monthlyCost = calculateAgencyCost(plan, usage, addOns, false);
  console.log(`Monthly Total: ${formatCurrency(monthlyCost)}`);

  // Calculate annual cost
  const annualCost = calculateAgencyCost(plan, usage, addOns, true);
  console.log(`Annual Monthly Total: ${formatCurrency(annualCost)}`);

  // Show savings
  const savings = (monthlyCost - annualCost) * 12;
  console.log(`Annual Savings: ${formatCurrency(savings)}`);
}

// ============================================================================
// EXAMPLE 3: Client Revenue Calculation
// ============================================================================

export function exampleClientRevenue() {
  console.log("\n=== Client Revenue Calculation ===");

  const clientCount = 50;
  const avgPrice = 297;
  const churnRate = 0.05; // 5% monthly churn

  const revenue = calculateClientRevenue(clientCount, avgPrice, churnRate);
  console.log(`Clients: ${clientCount}`);
  console.log(`Avg Price: ${formatCurrency(avgPrice)}`);
  console.log(`Churn Rate: ${formatPercentage(churnRate)}`);
  console.log(`Net MRR: ${formatCurrency(revenue)}`);
}

// ============================================================================
// EXAMPLE 4: Usage-Based Pricing
// ============================================================================

export function exampleUsageCost() {
  console.log("\n=== Usage-Based Pricing ===");

  const emailService: UsageService = {
    name: "Email Sending",
    unitPrice: 0.001,
    includedQuantity: 10000,
  };

  const emailsSent = 50000;
  const cost = calculateUsageCost(emailService, emailsSent);

  console.log(`Service: ${emailService.name}`);
  console.log(`Emails Sent: ${formatNumber(emailsSent)}`);
  console.log(`Included: ${formatNumber(emailService.includedQuantity || 0)}`);
  console.log(`Billable: ${formatNumber(emailsSent - (emailService.includedQuantity || 0))}`);
  console.log(`Cost: ${formatCurrency(cost)}`);
}

// ============================================================================
// EXAMPLE 5: Rebilling Profit
// ============================================================================

export function exampleRebillingProfit() {
  console.log("\n=== Rebilling Profit ===");

  const baseCost = 297; // Your cost per client
  const markupPercentage = 0.5; // 50% markup
  const clientCount = 25;

  const profit = calculateRebillingProfit(baseCost, markupPercentage, clientCount);
  const revenue = baseCost * (1 + markupPercentage) * clientCount;

  console.log(`Base Cost: ${formatCurrency(baseCost)}`);
  console.log(`Markup: ${formatPercentage(markupPercentage)}`);
  console.log(`Client Count: ${clientCount}`);
  console.log(`Price per Client: ${formatCurrency(baseCost * (1 + markupPercentage))}`);
  console.log(`Total Revenue: ${formatCurrency(revenue)}`);
  console.log(`Total Profit: ${formatCurrency(profit)}`);
  console.log(`Profit Margin: ${formatPercentage(profit / revenue)}`);
}

// ============================================================================
// EXAMPLE 6: SaaS Revenue Tiers
// ============================================================================

export function exampleSaaSRevenue() {
  console.log("\n=== SaaS Revenue Tiers ===");

  const tiers: SaaSTier[] = [
    { tierName: "Starter", price: 97, clientCount: 20 },
    { tierName: "Professional", price: 197, clientCount: 35 },
    { tierName: "Enterprise", price: 497, clientCount: 10 },
  ];

  const totalRevenue = calculateSaaSRevenue(tiers);

  console.log("Revenue by Tier:");
  tiers.forEach((tier) => {
    const tierRevenue = tier.price * tier.clientCount;
    console.log(
      `  ${tier.tierName}: ${tier.clientCount} × ${formatCurrency(tier.price)} = ${formatCurrency(tierRevenue)}`
    );
  });
  console.log(`Total MRR: ${formatCurrency(totalRevenue)}`);
}

// ============================================================================
// EXAMPLE 7: Breakeven Analysis
// ============================================================================

export function exampleBreakeven() {
  console.log("\n=== Breakeven Analysis ===");

  const fixedCosts = 2500; // Monthly fixed costs (software, staff, overhead)
  const pricePerClient = 297;
  const variableCostPerClient = 50; // Support, usage costs per client

  const breakevenClients = calculateBreakeven(
    fixedCosts,
    pricePerClient,
    variableCostPerClient
  );

  console.log(`Fixed Costs: ${formatCurrency(fixedCosts)}`);
  console.log(`Price per Client: ${formatCurrency(pricePerClient)}`);
  console.log(`Variable Cost per Client: ${formatCurrency(variableCostPerClient)}`);
  console.log(`Contribution Margin: ${formatCurrency(pricePerClient - variableCostPerClient)}`);
  console.log(`Breakeven Point: ${breakevenClients} clients`);
  console.log(
    `Breakeven Revenue: ${formatCurrency(breakevenClients * pricePerClient)}`
  );
}

// ============================================================================
// EXAMPLE 8: Revenue Growth Projection
// ============================================================================

export function exampleRevenueProjection() {
  console.log("\n=== Revenue Growth Projection ===");

  const startingRevenue = 10000;
  const monthlyGrowthRate = 0.1; // 10% monthly growth
  const months = 12;

  const projections = projectRevenueGrowth(startingRevenue, monthlyGrowthRate, months);

  console.log(`Starting Revenue: ${formatCurrency(startingRevenue)}`);
  console.log(`Monthly Growth Rate: ${formatPercentage(monthlyGrowthRate)}`);
  console.log("\nMonthly Projections:");

  projections.forEach((proj) => {
    console.log(
      `  Month ${proj.month}: ${formatCurrency(proj.revenue)} (${formatPercentage(proj.growth)} growth)`
    );
  });

  const finalRevenue = projections[projections.length - 1].revenue;
  const totalGrowth = (finalRevenue - startingRevenue) / startingRevenue;
  console.log(`\nFinal Revenue: ${formatCurrency(finalRevenue)}`);
  console.log(`Total Growth: ${formatPercentage(totalGrowth)}`);
}

// ============================================================================
// EXAMPLE 9: Customer Lifetime Value
// ============================================================================

export function exampleCustomerLifetimeValue() {
  console.log("\n=== Customer Lifetime Value ===");

  const avgMonthlyRevenue = 297;
  const avgLifespanMonths = 24; // Average customer stays 2 years
  const profitMargin = 0.6; // 60% profit margin

  const clv = calculateCustomerLifetimeValue(
    avgMonthlyRevenue,
    avgLifespanMonths,
    profitMargin
  );

  console.log(`Avg Monthly Revenue: ${formatCurrency(avgMonthlyRevenue)}`);
  console.log(`Avg Lifespan: ${avgLifespanMonths} months`);
  console.log(`Profit Margin: ${formatPercentage(profitMargin)}`);
  console.log(`Customer Lifetime Value: ${formatCurrency(clv)}`);
}

// ============================================================================
// EXAMPLE 10: Complete Business Model Analysis
// ============================================================================

export function exampleCompleteAnalysis() {
  console.log("\n=== Complete Business Model Analysis ===");

  // Setup
  const plan: AgencyPlan = {
    name: "Agency Pro",
    monthlyPrice: 297,
    annualPrice: 2988,
  };

  const currentClients = 40;
  const avgClientPrice = 397;
  const churnRate = 0.05;
  const acquisitionCost = 500;

  // Calculations
  const agencyCost = calculateAgencyCost(plan);
  const clientRevenue = calculateClientRevenue(currentClients, avgClientPrice, churnRate);
  const totalCosts = agencyCost + currentClients * 50; // $50 variable cost per client
  const profit = clientRevenue - totalCosts;
  const profitMargin = calculateProfitMargin(clientRevenue, totalCosts);
  const monthlyProfit = profit / currentClients;
  const paybackPeriod = calculateCACPaybackPeriod(acquisitionCost, monthlyProfit);

  // Results
  console.log("Current Situation:");
  console.log(`  Clients: ${currentClients}`);
  console.log(`  Avg Price: ${formatCurrency(avgClientPrice)}`);
  console.log(`  Monthly Churn: ${formatPercentage(churnRate)}`);

  console.log("\nRevenue:");
  console.log(`  Gross MRR: ${formatCurrency(clientRevenue)}`);
  console.log(`  Annual Run Rate: ${formatCurrency(clientRevenue * 12)}`);

  console.log("\nCosts:");
  console.log(`  Agency Plan: ${formatCurrency(agencyCost)}`);
  console.log(`  Variable Costs: ${formatCurrency(currentClients * 50)}`);
  console.log(`  Total Costs: ${formatCurrency(totalCosts)}`);

  console.log("\nProfitability:");
  console.log(`  Monthly Profit: ${formatCurrency(profit)}`);
  console.log(`  Profit Margin: ${formatPercentage(profitMargin)}`);
  console.log(`  Annual Profit: ${formatCurrency(profit * 12)}`);

  console.log("\nUnit Economics:");
  console.log(`  CAC: ${formatCurrency(acquisitionCost)}`);
  console.log(`  Profit per Client: ${formatCurrency(monthlyProfit)}`);
  console.log(`  CAC Payback: ${paybackPeriod.toFixed(1)} months`);

  // Breakeven for scaling
  const breakevenClients = calculateBreakeven(totalCosts, avgClientPrice, 50);
  console.log(`\nBreakeven: ${breakevenClients} clients (currently at ${currentClients})`);
}

// ============================================================================
// Run All Examples
// ============================================================================

export function runAllExamples() {
  exampleFormatting();
  exampleAgencyCost();
  exampleClientRevenue();
  exampleUsageCost();
  exampleRebillingProfit();
  exampleSaaSRevenue();
  exampleBreakeven();
  exampleRevenueProjection();
  exampleCustomerLifetimeValue();
  exampleCompleteAnalysis();
}

// Uncomment to run examples:
// runAllExamples();
