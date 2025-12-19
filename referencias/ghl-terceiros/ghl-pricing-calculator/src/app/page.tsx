"use client";

import { useState } from "react";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  BarChart3,
  Settings,
  ArrowRight,
  Zap
} from "lucide-react";
import AgencyCostCalculator from "@/components/calculators/AgencyCostCalculator";
import SaaSRevenueProjector from "@/components/calculators/SaaSRevenueProjector";
import UsageCostCalculator from "@/components/calculators/UsageCostCalculator";
import RebillingCalculator from "@/components/calculators/RebillingCalculator";
import ProfitDashboard from "@/components/calculators/ProfitDashboard";

type TabId = "agency-cost" | "saas-revenue" | "usage-cost" | "rebilling" | "dashboard";

interface Tab {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
}

const tabs: Tab[] = [
  {
    id: "agency-cost",
    label: "Agency Cost Calculator",
    shortLabel: "Agency Costs",
    icon: <Calculator className="w-5 h-5" />,
    description: "Calculate your total GoHighLevel costs",
  },
  {
    id: "saas-revenue",
    label: "SaaS Revenue Projector",
    shortLabel: "SaaS Revenue",
    icon: <TrendingUp className="w-5 h-5" />,
    description: "Model your SaaS business revenue",
  },
  {
    id: "usage-cost",
    label: "Usage Cost Calculator",
    shortLabel: "Usage Costs",
    icon: <Settings className="w-5 h-5" />,
    description: "Calculate SMS, calls, AI, and email costs",
  },
  {
    id: "rebilling",
    label: "Rebilling Calculator",
    shortLabel: "Rebilling",
    icon: <DollarSign className="w-5 h-5" />,
    description: "Calculate rebilling markup profits",
  },
  {
    id: "dashboard",
    label: "Profit Dashboard",
    shortLabel: "Dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
    description: "Comprehensive profit analysis",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("agency-cost");

  const renderTabContent = () => {
    switch (activeTab) {
      case "agency-cost":
        return <AgencyCostCalculator />;
      case "saas-revenue":
        return <SaaSRevenueProjector />;
      case "usage-cost":
        return <UsageCostCalculator />;
      case "rebilling":
        return <RebillingCalculator />;
      case "dashboard":
        return (
          <ProfitDashboard
            agencyCosts={{ platform: 497, usage: 150, addOns: 200 }}
            clientRevenue={{ subscriptions: 5000, rebilling: 1500, setupFees: 500 }}
            clientCount={20}
            projectionMonths={12}
          />
        );
      default:
        return <AgencyCostCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">GoHighLevel Pricing Calculator</h1>
                <p className="text-blue-100 text-sm">
                  Model your agency costs and revenue opportunities
                </p>
              </div>
            </div>
            <a
              href="https://www.gohighlevel.com/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
            >
              Official Pricing
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto pb-px -mb-px scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                  border-b-2 transition-all duration-200
                  ${activeTab === tab.id
                    ? "border-white text-white bg-white/10"
                    : "border-transparent text-blue-100 hover:text-white hover:border-white/50"
                  }
                `}
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>
              Pricing data based on{" "}
              <a
                href="https://help.gohighlevel.com/support/solutions/articles/155000001156-highlevel-pricing-guide"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                official GoHighLevel documentation
              </a>
              . Prices may change.
            </p>
            <p>Not affiliated with GoHighLevel. For educational purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
