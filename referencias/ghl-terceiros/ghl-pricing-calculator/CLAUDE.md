# GoHighLevel Pricing Calculator

## Project Overview

A Next.js web application for modeling GoHighLevel (GHL) agency pricing and revenue opportunities. Helps agencies understand their costs, project revenue, and optimize their pricing strategy.

**Live URL:** https://ghl-pricing-calculator.vercel.app
**GitHub:** https://github.com/waterloodigital/ghl-pricing-calculator
**Vercel Workspace:** Waterloo Digital

## Quick Start

```bash
cd /Users/jrpershall/Cursor/GoHighLevel/ghl-pricing-calculator
npm install
npm run dev
```

## Architecture

### Tech Stack
- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Recharts** for data visualizations
- **Lucide React** for icons
- **Radix UI** for accessible components

### Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main page with tab navigation
│   ├── layout.tsx         # Root layout with metadata
│   └── globals.css        # Global styles & CSS variables
├── components/
│   ├── calculators/       # 5 calculator components
│   │   ├── AgencyCostCalculator.tsx    # Plan + usage + add-ons
│   │   ├── SaaSRevenueProjector.tsx    # Revenue modeling
│   │   ├── UsageCostCalculator.tsx     # Detailed usage costs
│   │   ├── RebillingCalculator.tsx     # Markup profit analysis
│   │   └── ProfitDashboard.tsx         # Charts & metrics
│   └── ui/                # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── slider.tsx
│       └── ...
└── lib/
    ├── pricing-data.ts    # GHL pricing constants & types
    ├── calculations.ts    # Business logic functions
    └── utils.ts           # Formatting & utility functions
```

## Key Files

### `/src/lib/pricing-data.ts`
Contains all GoHighLevel pricing data:
- Core plans (Starter, Unlimited, Pro)
- Usage rates (SMS, voice, email, AI)
- Add-on services (AI Employee, HIPAA, WordPress, etc.)
- Carrier fees and A2P registration costs

### `/src/lib/calculations.ts`
Business logic functions:
- `calculateAgencyCost()` - Total agency costs
- `calculateClientRevenue()` - MRR calculations
- `calculateRebillingProfit()` - Markup profit analysis
- `calculateBreakeven()` - Break-even point
- `projectRevenueGrowth()` - Growth projections
- `calculateCustomerLifetimeValue()` - CLV calculations

### `/src/components/calculators/AgencyCostCalculator.tsx`
Main calculator with:
- Plan selection (Starter/Unlimited/Pro)
- Billing toggle (monthly/annual)
- Usage estimates (SMS, calls, emails, phones)
- Add-on checkboxes
- Real-time cost summary
- **User Guide** - Collapsible guide explaining all 5 tabs

## GoHighLevel Pricing Model

### Core Plans
| Plan | Price | Sub-Accounts | Rebilling |
|------|-------|--------------|-----------|
| Starter | $97/mo | Up to 3 | No |
| Unlimited | $297/mo | Unlimited | No |
| Pro (SaaS) | $497/mo | Unlimited | Yes |

### Usage-Based Costs
```typescript
const USAGE_RATES = {
  smsPerSegment: 0.0083,      // Plus carrier fees
  smsCarrierFee: 0.003,
  voiceOutbound: 0.0166,      // Per minute
  voiceInbound: 0.01165,
  emailsPer1000: 0.675,       // LC Email
  localPhone: 1.15,           // Per month
  tollFreePhone: 2.15,
};
```

### Add-On Services
```typescript
const ADDON_PRICES = {
  aiEmployee: 97,             // Per sub-account/month
  wordpressBasic: 10,
  wordpressStandard: 220,
  wordpressPremium: 497,
  hipaa: 297,
  whatsapp: 10,
  onlineListings: 30,
  dedicatedIP: 59,            // Pro plan only
  a2pPerCampaign: 11.025,
};
```

## Common Tasks

### Update Pricing Data
Edit `/src/lib/pricing-data.ts` to update rates or add new services.

### Add New Calculator
1. Create component in `/src/components/calculators/`
2. Add tab entry in `/src/app/page.tsx` tabs array
3. Add case in `renderTabContent()` switch statement

### Modify User Guide
Edit the `UserGuide` component in `/src/components/calculators/AgencyCostCalculator.tsx`

## Deployment

### Deploy to Vercel
```bash
vercel --prod --scope waterloo-digital
```

### Push to GitHub
```bash
git add .
git commit -m "description"
git push origin main
```

Vercel auto-deploys on push to main branch.

## Dependencies

```json
{
  "next": "^16.0.8",
  "react": "^19.0.0",
  "recharts": "^2.x",
  "lucide-react": "^0.x",
  "@radix-ui/react-*": "various",
  "tailwind-merge": "^2.x",
  "clsx": "^2.x",
  "class-variance-authority": "^0.x"
}
```

## Notes

- Pricing data based on official GHL documentation (December 2024)
- Not affiliated with GoHighLevel - for educational purposes
- Annual billing typically saves ~10% vs monthly
- Pro plan rebilling can offset the $200 upgrade cost with just ~$400/mo in marked-up usage

## Related Documentation

- [GHL Pricing Guide](https://help.gohighlevel.com/support/solutions/articles/155000001156-highlevel-pricing-guide)
- [GHL Official Pricing](https://www.gohighlevel.com/pricing)
