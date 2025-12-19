# GoHighLevel Pricing Calculator

A comprehensive web application for modeling GoHighLevel agency pricing and revenue opportunities. Calculate your costs, project SaaS revenue, model rebilling profits, and analyze your profit margins.

**Live Demo:** [https://ghl-pricing-calculator.vercel.app](https://ghl-pricing-calculator.vercel.app)

## Features

### 1. Agency Cost Calculator
Calculate your total GoHighLevel costs including:
- Platform subscription (Starter $97, Unlimited $297, Pro $497)
- Annual vs monthly billing with savings calculation
- Sub-account pricing
- Usage-based costs (SMS, calls, emails)
- Add-on services (AI Employee, HIPAA, WordPress hosting, etc.)

### 2. SaaS Revenue Projector
Model your SaaS business revenue:
- Create up to 5 client pricing tiers
- Set client counts per tier
- Project growth over 12-24 months
- Visualize revenue breakdown with charts
- Calculate rebilling revenue potential

### 3. Usage Cost Calculator
Deep dive into usage-based pricing:
- SMS/MMS with carrier fees and A2P registration
- Voice calls (inbound/outbound rates)
- Email services (LC Email tiers)
- AI services (Conversation AI, Content AI)
- Premium workflow execution costs

### 4. Rebilling Calculator
Compare plans and maximize profits:
- $297 vs $497 plan comparison
- Adjustable markup percentages (50-300%)
- Break-even analysis
- Monthly profit projections

### 5. Profit Dashboard
Comprehensive profit analysis:
- Key metrics (revenue, costs, profit margin, ROI)
- Revenue vs Costs area chart
- Revenue/Cost breakdown pie charts
- Profit margin trend analysis
- Scenario comparison (conservative/moderate/aggressive)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **UI Components:** Radix UI primitives

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/waterloodigital/ghl-pricing-calculator.git

# Navigate to project directory
cd ghl-pricing-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main page with tab navigation
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── calculators/
│   │   ├── AgencyCostCalculator.tsx
│   │   ├── SaaSRevenueProjector.tsx
│   │   ├── UsageCostCalculator.tsx
│   │   ├── RebillingCalculator.tsx
│   │   └── ProfitDashboard.tsx
│   └── ui/                # Reusable UI components
├── lib/
│   ├── pricing-data.ts    # GHL pricing constants
│   ├── calculations.ts    # Business logic functions
│   └── utils.ts           # Utility functions
```

## GoHighLevel Pricing Model

### Core Plans
| Plan | Monthly | Annual (per month) | Sub-Accounts |
|------|---------|-------------------|--------------|
| Starter | $97 | ~$87 | Up to 3 |
| Unlimited | $297 | ~$267 | Unlimited |
| Pro (SaaS) | $497 | ~$447 | Unlimited + Rebilling |

### Key Usage Costs
- **SMS:** $0.0083/segment + carrier fees
- **Voice Outbound:** $0.0166/min
- **Voice Inbound:** $0.01165/min
- **Email:** $0.675/1,000 emails (LC Email)
- **AI Employee:** $97/month per sub-account

### Rebilling (Pro Plan Only)
The Pro plan ($497/mo) allows you to markup usage costs to clients. Even a modest 50% markup on $500/month in client usage generates $250 in extra profit, effectively paying for the plan upgrade.

## Deployment

This project is deployed on Vercel under the Waterloo Digital workspace.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/waterloodigital/ghl-pricing-calculator)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is for educational purposes. Not affiliated with GoHighLevel. Pricing data is based on publicly available documentation and may change.

## Links

- [GoHighLevel Official Pricing](https://www.gohighlevel.com/pricing)
- [GoHighLevel Pricing Guide](https://help.gohighlevel.com/support/solutions/articles/155000001156-highlevel-pricing-guide)
- [Waterloo Digital](https://waterloodigital.com)
