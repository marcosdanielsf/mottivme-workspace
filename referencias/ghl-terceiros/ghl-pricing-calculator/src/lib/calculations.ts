/**
 * GoHighLevel Pricing Calculator - Calculation Functions
 *
 * This module contains all business logic calculations for:
 * - Agency costs
 * - Client revenue
 * - Usage-based pricing
 * - Rebilling profits
 * - SaaS revenue models
 * - Financial projections
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AgencyPlan {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  includedAccounts?: number;
  additionalAccountPrice?: number;
}

export interface UsageEstimate {
  emails?: number;
  sms?: number;
  calls?: number;
  aiAgentMinutes?: number;
}

export interface AddOn {
  name: string;
  price: number;
  billingCycle: "monthly" | "annual";
}

export interface UsageService {
  name: string;
  unitPrice: number; // Price per unit (e.g., per email, per SMS)
  includedQuantity?: number; // Optional included quantity in plan
}

export interface SaaSTier {
  tierName: string;
  price: number;
  clientCount: number;
}

export interface RevenueProjection {
  month: number;
  revenue: number;
  growth: number; // Growth percentage from previous month
}

// ============================================================================
// AGENCY COST CALCULATIONS
// ============================================================================

/**
 * Calculate total agency cost including base plan, usage, and add-ons
 * @param plan - The selected agency plan
 * @param usageEstimates - Estimated usage for emails, SMS, calls, etc.
 * @param addOns - Additional features or services
 * @param isAnnual - Whether billing annually (default: false)
 * @returns Total monthly cost
 */
export function calculateAgencyCost(
  plan: AgencyPlan,
  usageEstimates?: UsageEstimate,
  addOns?: AddOn[],
  isAnnual: boolean = false
): number {
  // Base plan cost
  const baseCost = isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice;

  // Calculate usage costs (if applicable)
  let usageCost = 0;
  if (usageEstimates) {
    // These are example rates - should be configured based on actual GHL pricing
    const emailRate = 0.001; // $1 per 1000 emails
    const smsRate = 0.01; // $0.01 per SMS
    const callRate = 0.02; // $0.02 per minute
    const aiRate = 0.10; // $0.10 per AI minute

    usageCost += (usageEstimates.emails || 0) * emailRate;
    usageCost += (usageEstimates.sms || 0) * smsRate;
    usageCost += (usageEstimates.calls || 0) * callRate;
    usageCost += (usageEstimates.aiAgentMinutes || 0) * aiRate;
  }

  // Calculate add-ons cost
  let addOnsCost = 0;
  if (addOns && addOns.length > 0) {
    addOnsCost = addOns.reduce((total, addOn) => {
      const cost = addOn.billingCycle === "annual" ? addOn.price / 12 : addOn.price;
      return total + cost;
    }, 0);
  }

  return baseCost + usageCost + addOnsCost;
}

// ============================================================================
// CLIENT REVENUE CALCULATIONS
// ============================================================================

/**
 * Calculate monthly recurring revenue from clients
 * @param clientCount - Number of active clients
 * @param avgPrice - Average price per client per month
 * @param churnRate - Monthly churn rate (e.g., 0.05 for 5%)
 * @returns Net monthly recurring revenue after churn
 */
export function calculateClientRevenue(
  clientCount: number,
  avgPrice: number,
  churnRate: number = 0
): number {
  const grossRevenue = clientCount * avgPrice;
  const churnLoss = grossRevenue * churnRate;
  return grossRevenue - churnLoss;
}

/**
 * Calculate the cost for a specific usage-based service
 * @param service - The service with pricing details
 * @param quantity - How many units to calculate
 * @returns Total cost for the service usage
 */
export function calculateUsageCost(
  service: UsageService,
  quantity: number
): number {
  const includedQty = service.includedQuantity || 0;
  const billableQuantity = Math.max(0, quantity - includedQty);
  return billableQuantity * service.unitPrice;
}

// ============================================================================
// REBILLING & PROFIT CALCULATIONS
// ============================================================================

/**
 * Calculate profit from rebilling services to clients
 * @param baseCost - Your cost for the service
 * @param markupPercentage - Your markup (e.g., 0.5 for 50% markup)
 * @param volume - Number of units or clients
 * @returns Total profit from rebilling
 */
export function calculateRebillingProfit(
  baseCost: number,
  markupPercentage: number,
  volume: number
): number {
  const pricePerUnit = baseCost * (1 + markupPercentage);
  const revenue = pricePerUnit * volume;
  const costs = baseCost * volume;
  return revenue - costs;
}

/**
 * Calculate total SaaS revenue from multiple pricing tiers
 * @param tiers - Array of pricing tiers with price and client count
 * @returns Total monthly recurring revenue
 */
export function calculateSaaSRevenue(tiers: SaaSTier[]): number {
  return tiers.reduce((total, tier) => {
    return total + (tier.price * tier.clientCount);
  }, 0);
}

/**
 * Calculate profit margin percentage
 * @param revenue - Total revenue
 * @param costs - Total costs
 * @returns Profit margin as a decimal (e.g., 0.35 for 35%)
 */
export function calculateProfitMargin(revenue: number, costs: number): number {
  if (revenue === 0) return 0;
  return (revenue - costs) / revenue;
}

// ============================================================================
// BREAKEVEN & FINANCIAL PROJECTIONS
// ============================================================================

/**
 * Calculate the breakeven point (number of clients needed)
 * @param fixedCosts - Monthly fixed costs (agency plan, overhead, etc.)
 * @param pricePerClient - Revenue per client per month
 * @param variableCostPerClient - Variable cost per client (usage, support, etc.)
 * @returns Number of clients needed to break even
 */
export function calculateBreakeven(
  fixedCosts: number,
  pricePerClient: number,
  variableCostPerClient: number = 0
): number {
  const contributionMargin = pricePerClient - variableCostPerClient;
  if (contributionMargin <= 0) {
    throw new Error("Price per client must be greater than variable cost per client");
  }
  return Math.ceil(fixedCosts / contributionMargin);
}

/**
 * Project revenue growth over time
 * @param startingRevenue - Initial monthly revenue
 * @param monthlyGrowthRate - Expected monthly growth rate (e.g., 0.1 for 10%)
 * @param months - Number of months to project
 * @returns Array of revenue projections by month
 */
export function projectRevenueGrowth(
  startingRevenue: number,
  monthlyGrowthRate: number,
  months: number
): RevenueProjection[] {
  const projections: RevenueProjection[] = [];
  let currentRevenue = startingRevenue;

  for (let month = 1; month <= months; month++) {
    const previousRevenue = month === 1 ? startingRevenue : projections[month - 2].revenue;
    currentRevenue = month === 1 ? startingRevenue : currentRevenue * (1 + monthlyGrowthRate);

    projections.push({
      month,
      revenue: currentRevenue,
      growth: month === 1 ? 0 : ((currentRevenue - previousRevenue) / previousRevenue),
    });
  }

  return projections;
}

// ============================================================================
// ADVANCED CALCULATIONS
// ============================================================================

/**
 * Calculate Customer Lifetime Value (CLV)
 * @param avgMonthlyRevenue - Average revenue per customer per month
 * @param avgCustomerLifespanMonths - Average months a customer stays
 * @param profitMargin - Profit margin as decimal (e.g., 0.3 for 30%)
 * @returns Customer lifetime value
 */
export function calculateCustomerLifetimeValue(
  avgMonthlyRevenue: number,
  avgCustomerLifespanMonths: number,
  profitMargin: number
): number {
  return avgMonthlyRevenue * avgCustomerLifespanMonths * profitMargin;
}

/**
 * Calculate Customer Acquisition Cost (CAC) payback period
 * @param acquisitionCost - Cost to acquire one customer
 * @param monthlyProfit - Monthly profit from one customer
 * @returns Number of months to recover acquisition cost
 */
export function calculateCACPaybackPeriod(
  acquisitionCost: number,
  monthlyProfit: number
): number {
  if (monthlyProfit <= 0) {
    throw new Error("Monthly profit must be greater than zero");
  }
  return acquisitionCost / monthlyProfit;
}

/**
 * Calculate Return on Investment (ROI)
 * @param initialInvestment - Initial investment amount
 * @param finalValue - Final value or returns
 * @returns ROI as a decimal (e.g., 0.5 for 50% ROI)
 */
export function calculateROI(initialInvestment: number, finalValue: number): number {
  if (initialInvestment === 0) return 0;
  return (finalValue - initialInvestment) / initialInvestment;
}

/**
 * Calculate effective pricing with volume discounts
 * @param basePrice - Base price per unit
 * @param quantity - Number of units
 * @param discountTiers - Array of {threshold: number, discount: number} objects
 * @returns Total cost after volume discounts
 */
export function calculateVolumeDiscountPrice(
  basePrice: number,
  quantity: number,
  discountTiers: { threshold: number; discount: number }[]
): number {
  // Sort tiers by threshold descending to find the best applicable discount
  const sortedTiers = [...discountTiers].sort((a, b) => b.threshold - a.threshold);

  let applicableDiscount = 0;
  for (const tier of sortedTiers) {
    if (quantity >= tier.threshold) {
      applicableDiscount = tier.discount;
      break;
    }
  }

  const discountedPrice = basePrice * (1 - applicableDiscount);
  return discountedPrice * quantity;
}

/**
 * Calculate annual contract value (ACV)
 * @param monthlyRecurring - Monthly recurring revenue
 * @param oneTimeFees - One-time setup or implementation fees
 * @returns Annual contract value
 */
export function calculateACV(monthlyRecurring: number, oneTimeFees: number = 0): number {
  return (monthlyRecurring * 12) + oneTimeFees;
}

/**
 * Calculate churn rate from customer counts
 * @param startingCustomers - Customers at start of period
 * @param endingCustomers - Customers at end of period
 * @param newCustomers - New customers added during period
 * @returns Churn rate as decimal (e.g., 0.05 for 5%)
 */
export function calculateChurnRate(
  startingCustomers: number,
  endingCustomers: number,
  newCustomers: number
): number {
  if (startingCustomers === 0) return 0;
  const churned = startingCustomers + newCustomers - endingCustomers;
  return Math.max(0, churned / startingCustomers);
}
