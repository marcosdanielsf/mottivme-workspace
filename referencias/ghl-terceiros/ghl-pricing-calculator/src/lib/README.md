# GHL Pricing Calculator - Library Functions

This directory contains all utility and calculation functions for the GoHighLevel Pricing Calculator.

## Files Overview

### 📐 `utils.ts` (64 lines)
General utility functions for formatting and basic calculations.

**Functions:**
- `cn(...inputs)` - Merge Tailwind CSS classes with proper precedence
- `formatCurrency(amount)` - Format numbers as USD currency ($1,234.56)
- `formatNumber(num)` - Format numbers with thousand separators (1,234.56)
- `formatPercentage(value, decimals?)` - Format decimals as percentages (15.0%)
- `calculateMonthlyFromAnnual(annual)` - Convert annual price to monthly equivalent
- `calculateAnnualSavings(monthly, annual)` - Calculate savings when paying annually

### 🧮 `calculations.ts` (334 lines)
Business logic calculations for pricing, revenue, and financial projections.

**Core Functions:**

#### Agency Costs
- `calculateAgencyCost(plan, usageEstimates?, addOns?, isAnnual?)` - Total agency cost including usage and add-ons

#### Revenue Calculations
- `calculateClientRevenue(clientCount, avgPrice, churnRate?)` - MRR after accounting for churn
- `calculateUsageCost(service, quantity)` - Cost for usage-based services
- `calculateSaaSRevenue(tiers)` - Total revenue from pricing tiers
- `calculateRebillingProfit(baseCost, markup, volume)` - Profit from rebilling services

#### Financial Analysis
- `calculateProfitMargin(revenue, costs)` - Profit margin percentage
- `calculateBreakeven(fixedCosts, pricePerClient, variableCost?)` - Number of clients to break even
- `projectRevenueGrowth(startingRevenue, growthRate, months)` - Revenue projections over time

#### Advanced Metrics
- `calculateCustomerLifetimeValue(avgMonthly, lifespan, margin)` - CLV calculation
- `calculateCACPaybackPeriod(acquisitionCost, monthlyProfit)` - Months to recover CAC
- `calculateROI(investment, finalValue)` - Return on investment
- `calculateVolumeDiscountPrice(basePrice, quantity, tiers)` - Pricing with volume discounts
- `calculateACV(monthlyRecurring, oneTimeFees?)` - Annual contract value
- `calculateChurnRate(starting, ending, new)` - Calculate churn from customer counts

### 📚 `example-usage.ts` (352 lines)
Comprehensive examples demonstrating how to use all functions.

**Example Categories:**
1. Formatting functions
2. Agency cost calculation
3. Client revenue calculation
4. Usage-based pricing
5. Rebilling profit
6. SaaS revenue tiers
7. Breakeven analysis
8. Revenue growth projection
9. Customer lifetime value
10. Complete business model analysis

### 📊 `pricing-data.ts` (existing)
Contains GoHighLevel pricing data, plan definitions, and configuration.

---

## Quick Start

### Import Functions

```typescript
// Formatting utilities
import { formatCurrency, formatPercentage, cn } from "@/lib/utils";

// Calculation functions
import {
  calculateAgencyCost,
  calculateClientRevenue,
  calculateBreakeven,
  projectRevenueGrowth,
} from "@/lib/calculations";

// Type definitions
import type { AgencyPlan, SaaSTier } from "@/lib/calculations";
```

### Basic Usage Examples

#### Format Currency
```typescript
import { formatCurrency } from "@/lib/utils";

const price = 1234.56;
console.log(formatCurrency(price)); // "$1,234.56"
```

#### Calculate Agency Cost
```typescript
import { calculateAgencyCost } from "@/lib/calculations";

const plan = {
  name: "Agency Pro",
  monthlyPrice: 297,
  annualPrice: 2988,
};

const monthlyCost = calculateAgencyCost(plan);
console.log(monthlyCost); // 297
```

#### Calculate Breakeven
```typescript
import { calculateBreakeven, formatCurrency } from "@/lib/utils";

const fixedCosts = 2500; // Monthly fixed costs
const pricePerClient = 297;
const variableCost = 50;

const clients = calculateBreakeven(fixedCosts, pricePerClient, variableCost);
console.log(`Need ${clients} clients to break even`);
// "Need 11 clients to break even"
```

#### Project Revenue Growth
```typescript
import { projectRevenueGrowth } from "@/lib/calculations";

const projections = projectRevenueGrowth(
  10000,  // Starting revenue
  0.1,    // 10% monthly growth
  12      // 12 months
);

projections.forEach(p => {
  console.log(`Month ${p.month}: $${p.revenue.toFixed(2)}`);
});
```

---

## Type Definitions

### AgencyPlan
```typescript
interface AgencyPlan {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  includedAccounts?: number;
  additionalAccountPrice?: number;
}
```

### UsageEstimate
```typescript
interface UsageEstimate {
  emails?: number;
  sms?: number;
  calls?: number;
  aiAgentMinutes?: number;
}
```

### AddOn
```typescript
interface AddOn {
  name: string;
  price: number;
  billingCycle: "monthly" | "annual";
}
```

### SaaSTier
```typescript
interface SaaSTier {
  tierName: string;
  price: number;
  clientCount: number;
}
```

### RevenueProjection
```typescript
interface RevenueProjection {
  month: number;
  revenue: number;
  growth: number; // Growth percentage from previous month
}
```

---

## Common Patterns

### React Component Example

```typescript
"use client";

import { useState } from "react";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import {
  calculateAgencyCost,
  calculateClientRevenue,
  calculateProfitMargin,
  type AgencyPlan,
} from "@/lib/calculations";

export function ProfitCalculator() {
  const [clientCount, setClientCount] = useState(25);
  const [avgPrice, setAvgPrice] = useState(297);

  const plan: AgencyPlan = {
    name: "Agency Pro",
    monthlyPrice: 297,
    annualPrice: 2988,
  };

  const agencyCost = calculateAgencyCost(plan);
  const revenue = calculateClientRevenue(clientCount, avgPrice);
  const costs = agencyCost + (clientCount * 50); // $50 variable cost per client
  const profit = revenue - costs;
  const margin = calculateProfitMargin(revenue, costs);

  return (
    <div>
      <h2>Profit Calculator</h2>
      <div>
        <label>Client Count: {clientCount}</label>
        <input
          type="range"
          value={clientCount}
          onChange={(e) => setClientCount(Number(e.target.value))}
          min="1"
          max="100"
        />
      </div>
      <div>
        <label>Avg Price: {formatCurrency(avgPrice)}</label>
        <input
          type="range"
          value={avgPrice}
          onChange={(e) => setAvgPrice(Number(e.target.value))}
          min="97"
          max="997"
        />
      </div>
      <div className="results">
        <p>Revenue: {formatCurrency(revenue)}</p>
        <p>Costs: {formatCurrency(costs)}</p>
        <p>Profit: {formatCurrency(profit)}</p>
        <p>Margin: {formatPercentage(margin)}</p>
      </div>
    </div>
  );
}
```

---

## Testing

All functions are pure and easily testable:

```typescript
import { describe, expect, test } from "@jest/globals";
import { formatCurrency, calculateAnnualSavings } from "@/lib/utils";
import { calculateBreakeven } from "@/lib/calculations";

describe("Utility Functions", () => {
  test("formatCurrency formats correctly", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
    expect(formatCurrency(99.9)).toBe("$99.90");
  });

  test("calculateAnnualSavings works", () => {
    expect(calculateAnnualSavings(297, 2988)).toBe(576);
  });
});

describe("Calculation Functions", () => {
  test("calculateBreakeven returns correct value", () => {
    expect(calculateBreakeven(2500, 297, 50)).toBe(11);
  });
});
```

---

## Performance Notes

- All functions are O(1) or O(n) where n is a small input array
- No external API calls or async operations
- Functions are pure with no side effects
- Safe to use in React components without memoization concerns
- TypeScript provides full type safety

---

## Contributing

When adding new functions:

1. Add type definitions at the top of the file
2. Include JSDoc comments with parameter descriptions
3. Group related functions together
4. Add examples to `example-usage.ts`
5. Run `npx tsc --noEmit` to verify type safety

---

**Last Updated:** December 10, 2024
