import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  LayoutDashboard, Megaphone, Users, Kanban, Inbox, FileText, Bot, Settings,
  Search, Bell, ChevronDown, Plus, Filter, MoreHorizontal, ArrowUpRight,
  Sparkles, Phone, MessageSquare, Workflow, PlayCircle, Shield,
  Target, BarChart3, Plug, Webhook, Link as LinkIcon, HelpCircle, FileType, CheckCircle2,
  Calendar, GripVertical, AlertCircle, Instagram, Briefcase, Hash, MapPin, Heart,
  Building2, DollarSign, Clock, Linkedin, Mail, X, Loader2, Menu, Sun, Moon, Globe
} from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { useLanguage } from './contexts/LanguageContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';
import { Button, Card, Badge, ChannelBadge, Input } from './components/UI';
import { NavItem, Metric, Campaign, Lead, Agent, PipelineCard, Channel, Account } from './types';
import { METRICS, RECENT_CAMPAIGNS, MOCK_LEADS, MOCK_AGENTS, PIPELINE_DATA, MOCK_ACCOUNTS } from './constants';
import { useSupabaseData, UIMetric, UICampaign, UILead, UIPipelineCard, UIAccount, UIAgent } from './hooks/useSupabaseData';

// Context for Supabase data
interface DataContextType {
  leads: UILead[];
  campaigns: UICampaign[];
  pipeline: UIPipelineCard[];
  accounts: UIAccount[];
  agents: UIAgent[];
  metrics: UIMetric[];
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    // Fallback to mock data if context not available
    return {
      leads: MOCK_LEADS as any,
      campaigns: RECENT_CAMPAIGNS as any,
      pipeline: PIPELINE_DATA as any,
      accounts: MOCK_ACCOUNTS as any,
      agents: MOCK_AGENTS as any,
      metrics: METRICS as any,
      loading: false,
      error: null,
    };
  }
  return context;
};

// --- Sub-components for specific views ---

const DashboardView = () => {
  const { metrics, campaigns, loading } = useData();

  const channelData = [
    { name: 'LinkedIn', value: 85, color: '#0A66C2' },
    { name: 'WhatsApp', value: 72, color: '#25D366' },
    { name: 'Instagram', value: 52, color: '#E1306C' },
    { name: 'Email', value: 32, color: '#6B7280' },
    { name: 'Phone', value: 24, color: '#3B82F6' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 dark:text-slate-500">Overview of your sales performance</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="text-xs md:text-sm flex-1 sm:flex-none">Last 30 Days</Button>
          <Button className="text-xs md:text-sm flex-1 sm:flex-none"><Plus size={16} /> <span className="hidden sm:inline">New</span> Campaign</Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="p-3 md:p-4 flex flex-col justify-between h-24 md:h-32">
            <div className="flex justify-between items-start gap-1">
              <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium truncate">{metric.label}</span>
              <span className={`text-[10px] md:text-xs font-medium px-1.5 md:px-2 py-0.5 rounded-full whitespace-nowrap ${metric.trend === 'up' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                {metric.change}
              </span>
            </div>
            <div>
              <h3 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">{metric.value}</h3>
              <p className="text-[10px] md:text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">{metric.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Channel Performance Chart */}
        <Card className="lg:col-span-2 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 md:mb-6">
            <h3 className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100">Channel Performance</h3>
            <Badge color="gray">Last 30 Days</Badge>
          </div>
          <div className="h-[200px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={channelData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={80} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Cadence Funnel */}
        <Card className="p-4 md:p-6">
          <h3 className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100 mb-4 md:mb-6">Cadence Funnel</h3>
          <div className="space-y-4 relative">
             <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-700"></div>
             {[
               { label: 'Started', value: '1,247', percent: '100%' },
               { label: 'Day 1-3', value: '892', percent: '71%' },
               { label: 'Day 4-7', value: '456', percent: '36%' },
               { label: 'Responded', value: '187', percent: '15%' },
               { label: 'Meeting', value: '45', percent: '3.6%' },
               { label: 'Won', value: '12', percent: '1%' },
             ].map((step, i) => (
               <div key={i} className="relative pl-8 flex items-center justify-between group">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white dark:border-slate-800 absolute left-0 top-1.5 shadow-sm z-10"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{step.label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">{step.percent} conversion</p>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded">{step.value}</span>
               </div>
             ))}
          </div>
        </Card>
      </div>

      {/* Active Campaigns Table */}
      <Card className="overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100">Active Campaigns</h3>
          <Button variant="ghost" className="text-xs md:text-sm text-blue-600 dark:text-blue-400">View All</Button>
        </div>

        {/* Mobile: Card view */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700">
          {campaigns.slice(0, 4).map((campaign) => (
            <div key={campaign.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">{campaign.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{campaign.owner}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${campaign.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 dark:text-slate-500">{campaign.status}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {campaign.channels.map((c: string) => <ChannelBadge key={c} channel={c} size="sm" />)}
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Leads: <span className="font-medium text-slate-700 dark:text-slate-300">{campaign.leads}</span></span>
                <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Responses: <span className="font-medium text-slate-700 dark:text-slate-300">{campaign.responses}</span></span>
                <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Conv: <span className="font-medium text-emerald-600 dark:text-emerald-400">{campaign.conversionRate}%</span></span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-medium">
              <tr>
                <th className="px-6 py-3">Campaign</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Channels</th>
                <th className="px-6 py-3">Leads</th>
                <th className="px-6 py-3">Responses</th>
                <th className="px-6 py-3">Conv.</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{campaign.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{campaign.owner}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{campaign.type}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {campaign.channels.map((c: string) => <ChannelBadge key={c} channel={c} size="sm" />)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 dark:text-slate-500">{campaign.leads}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 dark:text-slate-500">{campaign.responses}</td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{campaign.conversionRate}%</span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${campaign.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                       {campaign.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const LinkedInSearchView = () => {
  const [searchType, setSearchType] = useState('Sales Navigator');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">LinkedIn Lead Search</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Find prospects on LinkedIn with advanced filters</p>
        </div>
        <Button variant="outline">Saved Searches</Button>
      </div>

      <Card className="p-8 max-w-5xl mx-auto border-slate-200 shadow-lg shadow-slate-200/50">
        <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 dark:from-blue-900/20 dark:via-sky-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-100/50 dark:border-blue-800/50 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/3 -translate-y-1/3">
              <Linkedin size={140} />
           </div>
           <div className="p-4 bg-white dark:bg-slate-700 rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/5 z-10">
             <Linkedin className="w-8 h-8 text-[#0A66C2]" />
           </div>
           <div className="z-10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Professional Network Search</h3>
              <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500">Search LinkedIn profiles with Sales Navigator filters.</p>
           </div>
        </div>

        <div className="mb-8">
           <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide text-xs">Search Type</label>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Sales Navigator', icon: Target, desc: 'Advanced filters' },
                { label: 'By Company', icon: Building2, desc: 'Find employees' },
                { label: 'By Title', icon: Briefcase, desc: 'Job role search' },
                { label: 'Boolean Search', icon: Search, desc: 'Custom query' },
              ].map((type) => (
                <button
                    key={type.label}
                    onClick={() => setSearchType(type.label)}
                    className={`group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${searchType === type.label ? 'bg-blue-50/50 dark:bg-blue-900/30 border-[#0A66C2] text-[#0A66C2]' : 'bg-white dark:bg-slate-700 border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-blue-200 dark:hover:border-blue-700'}`}
                >
                   <type.icon size={24} className="mb-2" />
                   <span className="text-sm font-semibold">{type.label}</span>
                   <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">{type.desc}</span>
                </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Job Title / Keywords</label>
              <Input placeholder="e.g. CEO, CTO, Head of Sales" className="h-12" />
           </div>
           <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Company</label>
              <Input placeholder="e.g. Google, Microsoft" className="h-12" />
           </div>
           <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Location</label>
              <select className="w-full h-12 px-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100">
                <option>Brazil</option>
                <option>Sao Paulo, Brazil</option>
                <option>United States</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Industry</label>
              <select className="w-full h-12 px-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100">
                <option>All Industries</option>
                <option>Technology</option>
                <option>Financial Services</option>
                <option>Healthcare</option>
              </select>
           </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 mb-8">
           <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Filter size={14} /> Advanced Filters
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 dark:text-slate-500">Company Size</label>
                <select className="w-full h-10 px-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100">
                  <option>Any size</option>
                  <option>1-50 employees</option>
                  <option>51-200 employees</option>
                  <option>200+ employees</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 dark:text-slate-500">Seniority Level</label>
                <select className="w-full h-10 px-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100">
                  <option>All levels</option>
                  <option>Manager</option>
                  <option>Director</option>
                  <option>VP / C-Level</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 dark:text-slate-500">Years in Role</label>
                <select className="w-full h-10 px-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100">
                  <option>Any</option>
                  <option>1-2 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>
           </div>
           <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-[#0A66C2] bg-white dark:bg-slate-600" defaultChecked />
                <span className="text-sm text-slate-700 dark:text-slate-300">Has email</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-[#0A66C2] bg-white dark:bg-slate-600" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Has phone</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-[#0A66C2] bg-white dark:bg-slate-600" defaultChecked />
                <span className="text-sm text-slate-700 dark:text-slate-300">Open to connect</span>
              </label>
           </div>
        </div>

        <div className="flex flex-col items-center gap-4">
           <Button className="w-full max-w-sm h-14 text-lg font-bold bg-[#0A66C2] hover:bg-[#004182] text-white shadow-lg">
              <Search size={22} className="mr-2" /> Search LinkedIn
           </Button>
        </div>
      </Card>
    </div>
  );
};

const InstagramSearchView = () => {
  const [activeType, setActiveType] = useState('Profession');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Instagram Lead Search</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Find prospects on Instagram with smart filters</p>
        </div>
        <Button variant="outline">Saved Searches</Button>
      </div>

      <Card className="p-8 max-w-5xl mx-auto border-slate-200 shadow-lg shadow-slate-200/50">
        <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-pink-50 via-purple-50 to-orange-50 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-orange-900/20 rounded-2xl border border-pink-100/50 dark:border-pink-800/50 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/3 -translate-y-1/3">
              <Instagram size={140} />
           </div>
           <div className="p-4 bg-white dark:bg-slate-700 rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/5 z-10">
             <Instagram className="w-8 h-8 text-pink-600" />
           </div>
           <div className="z-10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Smart Search</h3>
              <p className="text-slate-600 dark:text-slate-400 dark:text-slate-500">AI-powered scraping respects platform limits to find high-value prospects.</p>
           </div>
        </div>

        {/* Search Type Selection */}
        <div className="mb-8">
           <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 px-1 uppercase tracking-wide text-xs">Search Type</label>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label: 'Profession', icon: Briefcase },
                { label: 'Hashtag', icon: Hash },
                { label: 'Location', icon: MapPin },
                { label: 'Followers', icon: Users },
                { label: 'Post Likes', icon: Heart },
              ].map((type) => (
                <button
                    key={type.label}
                    onClick={() => setActiveType(type.label)}
                    className={`group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden ${activeType === type.label ? 'bg-pink-50/50 dark:bg-pink-900/30 border-pink-500 text-pink-700 dark:text-pink-400' : 'bg-white dark:bg-slate-700 border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-pink-200 dark:hover:border-pink-700 hover:bg-slate-50 dark:hover:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                   {activeType === type.label && <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5" />}
                   <type.icon size={24} className={`mb-2 transition-transform duration-300 group-hover:scale-110 relative z-10 ${activeType === type.label ? 'text-pink-600 dark:text-pink-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-pink-500'}`} />
                   <span className="text-sm font-semibold relative z-10">{type.label}</span>
                </button>
              ))}
           </div>
        </div>

        {/* Main Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 px-1">
                 {activeType === 'Hashtag' ? 'Hashtags' : activeType === 'Followers' ? 'Target Profile' : 'Target Segment / Keyword'}
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                <Input
                    placeholder={activeType === 'Hashtag' ? '#marketing #business' : activeType === 'Followers' ? '@competitor_profile' : "e.g. Nutricionista, Marketing Agency, CEO"}
                    className="h-12 pl-12 text-base"
                />
              </div>
           </div>
           <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 px-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                <Input placeholder="e.g. São Paulo, Brazil" className="h-12 pl-12 text-base" />
              </div>
           </div>
        </div>

        {/* Advanced Filters */}
        <div className="bg-slate-50/80 dark:bg-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 mb-8">
           <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-white dark:bg-slate-600 rounded-md shadow-sm border border-slate-200 dark:border-slate-500 text-pink-600 dark:text-pink-400">
                <Filter size={14} />
              </div>
              Advanced Filters
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
              {[
                { label: 'Business accounts only', checked: true },
                { label: 'Has email in bio', checked: true },
                { label: 'Has link in bio', checked: false },
                { label: 'Has WhatsApp link', checked: false },
                { label: 'Min. 1k followers', checked: false },
                { label: 'Active in last 30d', checked: true },
              ].map((filter) => (
                <label key={filter.label} className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-white dark:hover:bg-slate-600 hover:shadow-sm rounded-lg transition-all">
                   <div className="relative flex items-center">
                     <input type="checkbox" className="peer w-5 h-5 rounded border-slate-300 dark:border-slate-500 text-pink-600 focus:ring-pink-500 focus:ring-offset-0 transition-all cursor-pointer bg-white dark:bg-slate-600" defaultChecked={filter.checked} />
                   </div>
                   <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{filter.label}</span>
                </label>
              ))}
           </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
           <Button variant="gradient" className="w-full max-w-sm h-14 text-lg font-bold shadow-xl shadow-pink-500/20 hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 border-none">
              <Search size={22} className="mr-2" /> Start AI Search
           </Button>
           <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <AlertCircle size={14} /> Search may take 2-5 minutes depending on volume
           </p>
        </div>

      </Card>
    </div>
  );
};

const CNPJSearchView = () => {
  const [searchType, setSearchType] = useState('CNAE');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CNPJ / Company Search</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Find companies and decision makers from Brazilian business registry</p>
        </div>
        <Button variant="outline">Saved Searches</Button>
      </div>

      <Card className="p-8 max-w-5xl mx-auto border-slate-200 shadow-lg shadow-slate-200/50">
        {/* Header com icone CNPJ */}
        <div className="flex items-center gap-4 mb-8 p-6 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border border-amber-100/50 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/3 -translate-y-1/3">
              <Briefcase size={140} />
           </div>
           <div className="p-4 bg-white rounded-2xl shadow-sm ring-1 ring-black/5 z-10">
             <Briefcase className="w-8 h-8 text-amber-600" />
           </div>
           <div className="z-10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Company Intelligence</h3>
              <p className="text-slate-600 dark:text-slate-300">Access Brazilian company registry data and find decision makers.</p>
           </div>
        </div>

        {/* Search Type Selection */}
        <div className="mb-8">
           <label className="block text-sm font-bold text-slate-700 mb-3 px-1 uppercase tracking-wide text-xs">Search By</label>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'CNAE Code', icon: Hash, desc: 'Industry classification' },
                { label: 'Company Name', icon: Building2, desc: 'Search by name' },
                { label: 'Specific CNPJ', icon: FileText, desc: 'Direct lookup' },
                { label: 'Capital Range', icon: DollarSign, desc: 'By company size' },
              ].map((type) => (
                <button
                    key={type.label}
                    onClick={() => setSearchType(type.label)}
                    className={`group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${searchType === type.label ? 'bg-amber-50/50 border-amber-500 text-amber-700 shadow-md shadow-amber-100' : 'bg-white border-slate-100 text-slate-500 hover:border-amber-200'}`}
                >
                   <type.icon size={24} className="mb-2" />
                   <span className="text-sm font-semibold">{type.label}</span>
                   <span className="text-xs text-slate-400 mt-1">{type.desc}</span>
                </button>
              ))}
           </div>
        </div>

        {/* CNAE Selector (quando CNAE selecionado) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 px-1">CNAE Code</label>
              <select className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 dark:text-white">
                <option>6201-5 - Desenvolvimento de software sob encomenda</option>
                <option>6202-3 - Desenvolvimento de software customizável</option>
                <option>6204-0 - Consultoria em TI</option>
                <option>7020-4 - Atividades de consultoria em gestão</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 px-1">State / City</label>
              <div className="flex gap-2">
                <select className="flex-1 h-12 px-4 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 dark:text-white">
                  <option>São Paulo</option>
                  <option>Rio de Janeiro</option>
                  <option>Minas Gerais</option>
                </select>
                <select className="flex-1 h-12 px-4 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-slate-900 dark:text-white">
                  <option>All Cities</option>
                  <option>São Paulo</option>
                  <option>Campinas</option>
                </select>
              </div>
           </div>
        </div>

        {/* Company Filters */}
        <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200 mb-8">
           <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Filter size={14} /> Company Filters
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Capital Range (R$)</label>
                <div className="flex gap-2">
                  <Input placeholder="Min: 100.000" className="h-10 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20" />
                  <Input placeholder="Max: 10.000.000" className="h-10 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Employees</label>
                <select className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-900 dark:text-white">
                  <option>Any size</option>
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>51-200 employees</option>
                  <option>200+ employees</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Founded Year</label>
                <div className="flex gap-2">
                  <Input placeholder="From: 2015" className="h-10 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20" />
                  <Input placeholder="To: 2024" className="h-10 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20" />
                </div>
              </div>
           </div>
           <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500 bg-white dark:bg-slate-800" defaultChecked />
                <span className="text-sm">Only active companies</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500 bg-white dark:bg-slate-800" defaultChecked />
                <span className="text-sm">Enrich with LinkedIn</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500 bg-white dark:bg-slate-800" defaultChecked />
                <span className="text-sm">Find decision makers</span>
              </label>
           </div>
        </div>

        <div className="flex flex-col items-center gap-4">
           <Button className="w-full max-w-sm h-14 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20 border-none">
              <Search size={22} className="mr-2" /> Search Companies
           </Button>
           <p className="text-xs text-slate-400 dark:text-slate-500">
              Results limited to 1,000 companies per search
           </p>
        </div>
      </Card>
    </div>
  );
};

const ActiveCadencesView = () => {
  const cadences = [
    {
      id: '1',
      name: 'CEOs Tech SP',
      code: 'OUT-HT-14',
      channels: ['linkedin', 'whatsapp', 'email', 'phone'],
      leads: 150,
      progress: 78,
      day: 8,
      totalDays: 14,
      responding: 45,
      status: 'running'
    },
    {
      id: '2',
      name: 'Instagram Fitness BR',
      code: 'IG-MT-7',
      channels: ['instagram', 'whatsapp'],
      leads: 300,
      progress: 52,
      day: 4,
      totalDays: 7,
      responding: 67,
      status: 'running'
    },
    {
      id: '3',
      name: 'Doctors SP Q4',
      code: 'OUT-MT-10',
      channels: ['linkedin', 'email'],
      leads: 200,
      progress: 100,
      day: 10,
      totalDays: 10,
      responding: 42,
      status: 'completed'
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Active Cadences</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Monitor and manage your running sequences</p>
        </div>
        <Button><Plus size={16}/> Create Cadence</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {['All', 'Running', 'Paused', 'Completed'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${tab === 'All' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cadences Table */}
      <Card>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Cadence</th>
              <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Type</th>
              <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Channels</th>
              <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Leads</th>
              <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Progress</th>
              <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cadences.map(cadence => (
              <tr key={cadence.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 dark:text-white">{cadence.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Code: {cadence.code}</div>
                </td>
                <td className="px-6 py-4">
                  <Badge color="blue">{cadence.code.split('-')[0]}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {cadence.channels.map(c => <ChannelBadge key={c} channel={c as Channel} size="sm" />)}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{cadence.leads}</td>
                <td className="px-6 py-4">
                  <div className="w-32">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Day {cadence.day}/{cadence.totalDays}</span>
                      <span className="font-medium">{cadence.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${cadence.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${cadence.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${cadence.status === 'running' ? 'bg-emerald-500 animate-pulse' : cadence.status === 'completed' ? 'bg-slate-400' : 'bg-amber-500'}`}></div>
                    <span className="capitalize">{cadence.status}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{cadence.responding} responding</div>
                </td>
                <td className="px-6 py-4">
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const ShowRateGuardView = () => {
  const meetings = [
    {
      id: '1',
      leadName: 'Joao Silva',
      company: 'TechCorp',
      date: 'Tomorrow',
      time: '10:00 AM',
      type: 'Discovery Call',
      confirmations: {
        emailL24h: 'confirmed',
        whatsappL12h: 'confirmed',
        smsL2h: 'pending'
      }
    },
    {
      id: '2',
      leadName: 'Maria Santos',
      company: 'StartupXYZ',
      date: 'Dec 13',
      time: '14:00',
      type: 'Product Demo',
      confirmations: {
        emailL24h: 'sent',
        whatsappL12h: 'pending',
        smsL2h: 'pending'
      }
    },
    {
      id: '3',
      leadName: 'Pedro Costa',
      company: 'FinCo',
      date: 'Dec 15',
      time: '09:00',
      type: 'Closing Call',
      confirmations: {
        emailL24h: 'queued',
        whatsappL12h: 'queued',
        smsL2h: 'queued'
      }
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="text-emerald-600" /> Show-Rate Guard™
          </h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Ensure 70%+ meeting attendance with automated confirmations</p>
        </div>
        <Button variant="outline"><Settings size={16}/> Configure</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="text-sm text-slate-500 mb-1">This Week</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">12</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">meetings scheduled</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <div className="text-sm text-slate-500 mb-1">Show Rate</div>
          <div className="text-3xl font-bold text-emerald-600">78%</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">Target: 70% ✅</div>
        </Card>
        <Card className="p-6 border-l-4 border-l-amber-500">
          <div className="text-sm text-slate-500 mb-1">No-Shows Saved</div>
          <div className="text-3xl font-bold text-amber-600">4</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">rescheduled this month</div>
        </Card>
      </div>

      {/* Confirmation Sequence Info */}
      <Card className="p-6 bg-slate-50/50">
        <h3 className="font-bold text-slate-900 mb-4">Confirmation Sequence</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">L-24h</div>
            <div>
              <div className="text-sm font-medium">Email + WhatsApp</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Reminder with calendar link</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-xs font-bold">L-12h</div>
            <div>
              <div className="text-sm font-medium">WhatsApp</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">If no response</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs font-bold">L-2h</div>
            <div>
              <div className="text-sm font-medium">SMS</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Final reminder + link</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs font-bold">L-30m</div>
            <div>
              <div className="text-sm font-medium">WhatsApp</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">"Starting soon!"</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Upcoming Meetings */}
      <Card>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-white">Upcoming Meetings</h3>
          <Button variant="ghost" className="text-sm text-blue-600">View Calendar</Button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Meeting</th>
              <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Lead</th>
              <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Date</th>
              <th className="px-6 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Confirmations</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {meetings.map(meeting => (
              <tr key={meeting.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 dark:text-white">{meeting.type}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">{meeting.leadName}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{meeting.company}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">{meeting.date}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{meeting.time}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {Object.entries(meeting.confirmations).map(([key, status]) => (
                      <div
                        key={key}
                        className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                          status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                          status === 'sent' ? 'bg-blue-100 text-blue-700' :
                          status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {status === 'confirmed' && <CheckCircle2 size={12} />}
                        {status === 'pending' && <Clock size={12} />}
                        {key.replace('L', 'L-').replace('h', 'h')}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Button variant="outline" className="text-xs h-8">Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const CampaignsView = () => {
  const { campaigns, loading } = useData();
  const [activeTab, setActiveTab] = useState('All');
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);

  const tabs = ['All', 'Connection', 'Warm-up', 'Authority', 'Instagram DM', 'Multi-channel'];

  // Filtrar campanhas baseado no tab ativo
  const filteredCampaigns = activeTab === 'All'
    ? campaigns
    : campaigns.filter((c: any) => c.type === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading campaigns...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Campaigns</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Create and manage your outreach campaigns</p>
        </div>
        <Button><Plus size={16}/> New Campaign</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCampaigns.length > 0 ? (
          filteredCampaigns.map(campaign => (
            <Card key={campaign.id} className="p-6 hover:shadow-lg transition-all border-l-4 border-l-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{campaign.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge color={campaign.type === 'Multi-channel' ? 'purple' : campaign.type === 'Instagram DM' ? 'pink' : 'blue'}>
                      {campaign.type}
                    </Badge>
                    <span className={`flex items-center gap-1 text-xs ${campaign.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      <div className={`w-2 h-2 rounded-full ${campaign.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      {campaign.status}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal size={16} />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                <span>👤 {campaign.owner}</span>
                <span>•</span>
                <span>Cadence: {campaign.cadenceName}</span>
              </div>

              <div className="flex gap-1 mb-4">
                {campaign.channels.map(c => <ChannelBadge key={c} channel={c} size="sm" />)}
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{campaign.leads}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Leads</div>
                </div>
                <div className="text-center border-x border-slate-200 dark:border-slate-700">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{campaign.responses}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Responses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{campaign.conversionRate}%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Conversion</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1 text-sm" onClick={() => setSelectedCampaign(campaign)}>View Details</Button>
                <Button variant="secondary" className="flex-1 text-sm">Edit</Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            No campaigns found for "{activeTab}"
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedCampaign(null)}>
          <Card className="w-full max-w-2xl m-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedCampaign.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge color="blue">{selectedCampaign.type}</Badge>
                  <Badge color={selectedCampaign.status === 'Active' ? 'green' : 'gray'}>{selectedCampaign.status}</Badge>
                </div>
              </div>
              <button onClick={() => setSelectedCampaign(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">Owner</label>
                <p className="text-slate-900 dark:text-white">{selectedCampaign.owner}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">Cadence</label>
                <p className="text-slate-900 dark:text-white">{selectedCampaign.cadenceName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">Channels</label>
                <div className="flex gap-1 mt-1">
                  {selectedCampaign.channels.map(c => <ChannelBadge key={c} channel={c} size="md" />)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{selectedCampaign.leads}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Total Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{selectedCampaign.responses}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Responses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">{selectedCampaign.conversionRate}%</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Conversion</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedCampaign(null)}>Close</Button>
              <Button className="flex-1">Edit Campaign</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const ContentStudioView = () => {
  const posts = [
    { id: '1', title: 'Como escalar vendas B2B em 2025', status: 'published', platform: 'linkedin', date: 'Dec 10', engagement: '234 likes' },
    { id: '2', title: '5 erros que estão matando suas cold calls', status: 'scheduled', platform: 'linkedin', date: 'Dec 12', engagement: 'Scheduled 09:00' },
    { id: '3', title: 'Story: Behind the scenes', status: 'draft', platform: 'instagram', date: '--', engagement: 'Draft' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Content Studio</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Create and schedule content for social selling</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Calendar View</Button>
          <Button><Plus size={16}/> Create Post</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {['All Content', 'Published', 'Scheduled', 'Drafts'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${tab === 'All Content' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all">
            <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <FileText size={48} className="text-blue-300" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <ChannelBadge channel={post.platform as Channel} size="sm" />
                <Badge color={post.status === 'published' ? 'green' : post.status === 'scheduled' ? 'blue' : 'gray'}>
                  {post.status}
                </Badge>
              </div>
              <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{post.title}</h3>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
                <span>{post.date}</span>
                <span>{post.engagement}</span>
              </div>
            </div>
          </Card>
        ))}

        {/* Add New Card */}
        <Card className="border-2 border-dashed border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-center min-h-[280px]">
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus size={24} className="text-slate-400 dark:text-slate-500" />
            </div>
            <p className="font-medium text-slate-600 dark:text-slate-300">Create New Post</p>
            <p className="text-xs text-slate-400 mt-1">AI-powered content generation</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

const LeadsView = () => {
  const { leads, loading } = useData();
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading leads...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lead Intelligence</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Manage and enrich your prospect database</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline"><Search size={16}/> LinkedIn Search</Button>
           <Button variant="outline" className="text-pink-600 border-pink-200 hover:bg-pink-50"><Search size={16}/> Instagram Search</Button>
           <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50"><Search size={16}/> CNPJ Search</Button>
           <Button><Plus size={16}/> Import</Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div className="flex gap-2">
             {['All Leads', 'Lists', 'Enrichment Queue', 'ICP Analysis'].map(tab => (
               <button key={tab} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === 'All Leads' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'}`}>
                 {tab}
               </button>
             ))}
           </div>
           <div className="relative w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
             <Input placeholder="Search leads..." className="pl-9" />
           </div>
        </div>
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 w-8"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="px-6 py-3">Lead</th>
                <th className="px-6 py-3">Company</th>
                <th className="px-6 py-3">Channels</th>
                <th className="px-6 py-3">ICP Score</th>
                <th className="px-6 py-3">Cadence</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {leads.map((lead: any) => (
                 <tr
                    key={lead.id}
                    className="hover:bg-slate-50/50 group cursor-pointer transition-colors"
                    onClick={() => setSelectedLead(lead)}
                 >
                    <td className="px-6 py-4" onClick={(e: any) => e.stopPropagation()}><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={lead.avatar} alt={lead.name} className="w-10 h-10 rounded-full bg-slate-200 object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{lead.name}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{lead.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{lead.company}</td>
                    <td className="px-6 py-4">
                       <div className="flex gap-1">
                          {lead.channels.map(c => <ChannelBadge key={c} channel={c} size="sm" />)}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <span className={`font-bold ${lead.icpScore > 80 ? 'text-emerald-600' : lead.icpScore > 50 ? 'text-amber-600' : 'text-slate-600'}`}>{lead.icpScore}</span>
                          <div className={`w-2 h-2 rounded-full ${lead.icpScore > 80 ? 'bg-emerald-500' : lead.icpScore > 50 ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                       </div>
                       <span className="text-xs text-slate-400 dark:text-slate-500">{lead.icpScore > 80 ? 'High' : lead.icpScore > 50 ? 'Med' : 'Low'}</span>
                    </td>
                    <td className="px-6 py-4">
                      {lead.cadenceStatus ? (
                        <div>
                          <div className="text-xs font-semibold text-slate-900 dark:text-white">{lead.cadenceStatus.step}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            Next: <ChannelBadge channel={lead.cadenceStatus.nextActivity} size="sm"/>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Available</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-opacity">
                         <MoreHorizontal size={16}/>
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
        </table>
      </Card>

      {/* Lead Details Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="w-[480px] bg-white shadow-2xl h-full overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <img src={selectedLead.avatar} className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700" alt={selectedLead.name} />
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedLead.name}</h2>
                  <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">{selectedLead.title} @ {selectedLead.company}</p>
                </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 dark:text-slate-400 dark:text-slate-500">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* ICP Score */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">ICP Score</label>
                <div className="flex items-center gap-3 mt-2">
                  <div className={`text-4xl font-bold ${selectedLead.icpScore > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {selectedLead.icpScore}
                  </div>
                  <Badge color={selectedLead.icpScore > 80 ? 'green' : 'yellow'}>
                    {selectedLead.icpScore > 80 ? 'High Match' : 'Medium Match'}
                  </Badge>
                </div>
              </div>

              {/* Channels */}
              <div>
                <label className="text-sm font-semibold text-slate-900 dark:text-white">Available Channels</label>
                <div className="flex gap-2 mt-2">
                  {selectedLead.channels.map(c => <ChannelBadge key={c} channel={c} size="md" />)}
                </div>
              </div>

              {/* Cadence Status */}
              {selectedLead.cadenceStatus ? (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <label className="text-sm font-semibold text-blue-800">Active Cadence</label>
                  <div className="mt-2">
                    <div className="font-bold text-blue-900 text-lg">{selectedLead.cadenceStatus.name}</div>
                    <div className="text-sm text-blue-700 font-medium">{selectedLead.cadenceStatus.step}</div>
                    <div className="flex items-center gap-2 mt-3 text-sm text-blue-700 bg-white/50 p-2 rounded-lg inline-flex">
                      Next Step: <ChannelBadge channel={selectedLead.cadenceStatus.nextActivity} size="sm" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                  <p className="text-slate-500 text-sm">Not in any active cadence</p>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-1 gap-3 pt-4 border-t border-slate-100">
                <Button className="w-full">Start Cadence</Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">Send Message</Button>
                  <Button variant="secondary" className="w-full">Add to List</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CadenceBuilderView = () => {
  // Estados para o formulário
  const [channels, setChannels] = useState<{ [key: string]: boolean }>({
    linkedin: true,
    instagram: false,
    whatsapp: true,
    email: true,
    phoneMobile: true,
    phoneBusiness: false,
  });

  const [params, setParams] = useState({
    ticketRange: 'R$ 5.000 - R$ 15.000',
    leadSource: 'outbound',
    touchLevel: 'high',
    duration: 14,
  });

  const [showGenerated, setShowGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowGenerated(false);
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setShowGenerated(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cadence Builder</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Create intelligent multi-channel outreach sequences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button variant="outline">Use Template <ChevronDown size={14} className="ml-1"/></Button>
        </div>
      </div>

      {/* STEP 1: Available Channels */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">1</span>
          Available Channels
        </h2>
        <p className="text-sm text-slate-500 mb-4">Which channels are available for this lead/campaign?</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
            { key: 'instagram', label: 'Instagram', icon: Instagram, color: '#E1306C' },
            { key: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: '#25D366' },
            { key: 'email', label: 'Email', icon: Mail, color: '#6B7280' },
            { key: 'phoneMobile', label: 'Phone (Mobile)', icon: Phone, color: '#3B82F6' },
            { key: 'phoneBusiness', label: 'Phone (Business)', icon: Phone, color: '#8B5CF6' },
          ].map(channel => (
            <button
              key={channel.key}
              onClick={() => setChannels({...channels, [channel.key]: !channels[channel.key]})}
              className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                channels[channel.key]
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <channel.icon size={24} style={{ color: channels[channel.key] ? channel.color : '#94a3b8' }} />
              <span className={`text-xs font-medium mt-2 ${channels[channel.key] ? 'text-slate-900' : 'text-slate-500'}`}>
                {channel.label}
              </span>
              {channels[channel.key] && (
                <CheckCircle2 size={16} className="text-blue-600 mt-1" />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* STEP 2: Campaign Parameters */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">2</span>
          Campaign Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Average Ticket</label>
            <select
              className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              value={params.ticketRange}
              onChange={e => setParams({...params, ticketRange: e.target.value})}
            >
              <option>R$ 1.000 - R$ 5.000</option>
              <option>R$ 5.000 - R$ 15.000</option>
              <option>R$ 15.000 - R$ 50.000</option>
              <option>R$ 50.000+</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Lead Source</label>
            <div className="flex gap-4">
              {['outbound', 'inbound', 'referral'].map(source => (
                <label key={source} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="leadSource"
                    checked={params.leadSource === source}
                    onChange={() => setParams({...params, leadSource: source})}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="capitalize text-sm text-slate-700 dark:text-slate-200">{source}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Touch Intensity</label>
            <div className="flex gap-2">
              {[
                { value: 'low', label: 'Low (5-8)', desc: 'Light touch' },
                { value: 'medium', label: 'Medium (9-12)', desc: 'Balanced' },
                { value: 'high', label: 'High (13+)', desc: 'Aggressive' },
              ].map(level => (
                <button
                  key={level.value}
                  onClick={() => setParams({...params, touchLevel: level.value})}
                  className={`flex-1 p-3 rounded-lg border-2 text-center transition-all ${
                    params.touchLevel === level.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`text-sm font-medium ${params.touchLevel === level.value ? 'text-blue-900' : 'text-slate-700'}`}>{level.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Cadence Duration</label>
            <select
              className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              value={params.duration}
              onChange={e => setParams({...params, duration: parseInt(e.target.value)})}
            >
              <option value={7}>7 days</option>
              <option value={10}>10 days</option>
              <option value={14}>14 days</option>
              <option value={21}>21 days</option>
              <option value={30}>30 days</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            className="h-14 px-8 text-lg font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <><Loader2 size={20} className="mr-2 animate-spin" /> Generating Strategy...</>
            ) : (
              <><Sparkles size={20} className="mr-2" /> Generate Optimal Cadence</>
            )}
          </Button>
        </div>
      </Card>

      {/* GENERATED CADENCE (mostrar após clicar Generate) */}
      {showGenerated && (
        <Card className="p-6 border-l-4 border-l-blue-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-start mb-6">
             <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">GENERATED CADENCE</h2>
                <p className="text-sm text-slate-500 capitalize">
                  {params.leadSource} |
                  {params.touchLevel === 'high' ? ' High Touch' : params.touchLevel === 'medium' ? ' Medium Touch' : ' Light Touch'} |
                  Semi-Automatic | {params.duration} Days
                </p>
             </div>
             <Badge color="blue">Code: {params.leadSource === 'outbound' ? 'OUT' : 'IN'}-{params.touchLevel.toUpperCase().charAt(0)}T-{params.duration}</Badge>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px] border border-slate-200 rounded-lg">
               {/* Header Row */}
               <div className="grid grid-cols-8 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <div className="p-3 border-r border-slate-200 dark:border-slate-700">Channel</div>
                  {['Day 1', 'Day 2', 'Day 4', 'Day 6', 'Day 8', 'Day 10', `Day ${params.duration}`].map(day => (
                    <div key={day} className="p-3 border-r border-slate-200 text-center">{day}</div>
                  ))}
               </div>
               
               {/* Channel Rows - Simulated dynamic rows based on channels selected */}
               {Object.entries(channels).filter(([_, active]) => active).map(([key, _], idx) => {
                 const icons: {[key:string]: any} = { linkedin: Linkedin, instagram: Instagram, whatsapp: MessageSquare, email: Mail, phoneMobile: Phone, phoneBusiness: Phone };
                 const labels: {[key:string]: string} = { linkedin: 'LinkedIn', instagram: 'Instagram', whatsapp: 'WhatsApp', email: 'Email', phoneMobile: 'Phone (Mobile)', phoneBusiness: 'Phone (Business)' };
                 const BadgeType = (['linkedin', 'instagram', 'whatsapp', 'email', 'phone'].includes(key.replace('Mobile','').replace('Business','').toLowerCase())) ? key.replace('Mobile','').replace('Business','').toLowerCase() : null;

                 return (
                 <div key={key} className="grid grid-cols-8 border-b border-slate-100 last:border-0 text-sm">
                    <div className="p-3 border-r border-slate-100 font-medium text-slate-700 flex items-center gap-2">
                       {BadgeType ? (
                         <ChannelBadge channel={BadgeType as Channel} size="sm" />
                       ) : (
                         icons[key] && React.createElement(icons[key], {size: 20, className: "text-slate-500 dark:text-slate-400 dark:text-slate-500"})
                       )}
                       {labels[key]}
                    </div>
                    {/* Grid Cells - Mocking the matrix */}
                    {[...Array(7)].map((_, cellIdx) => {
                       // Density factor based on intensity
                       const density = params.touchLevel === 'high' ? 2 : params.touchLevel === 'medium' ? 3 : 4;
                       const isActive = (idx + cellIdx + key.length) % density === 0; 
                       
                       return (
                         <div key={cellIdx} className="p-3 border-r border-slate-100 flex items-center justify-center hover:bg-slate-50 cursor-pointer transition-colors group">
                            {isActive ? (
                               <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm border border-blue-200 font-bold group-hover:scale-110 transition-transform">
                                  ●
                               </div>
                            ) : (
                               <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-200 opacity-0 group-hover:opacity-100 flex items-center justify-center text-slate-300">
                                  <Plus size={14} />
                               </div>
                            )}
                         </div>
                       );
                    })}
                 </div>
               )})}
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center bg-slate-50 p-4 rounded-lg">
             <div className="text-sm text-slate-600 dark:text-slate-300">
                <span className="font-bold">Total: {params.touchLevel === 'high' ? '14+' : params.touchLevel === 'medium' ? '9-12' : '5-8'} touches</span> • Daily limit respected ✓
             </div>
             <div className="flex gap-2">
                <Button variant="outline">Edit Cadence</Button>
                <Button>Apply to Campaign</Button>
                <Button variant="secondary">Save as Template</Button>
             </div>
          </div>
        </Card>
      )}
    </div>
  );
};

const PipelineView = () => {
  const { pipeline, loading } = useData();
  const stages = ['New', 'Relationship', 'Scheduled', 'Won'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading pipeline...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pipeline</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Track your opportunities</p>
        </div>
        <Button><Plus size={16}/> Add Deal</Button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 h-full min-w-max pb-4">
          {stages.map(stage => {
            const cards = pipeline.filter((c: any) => c.stage === stage);
            return (
              <div key={stage} className="w-80 bg-slate-100 rounded-xl flex flex-col max-h-full">
                <div className="p-4 font-bold text-slate-700 flex justify-between items-center sticky top-0 bg-slate-100 rounded-t-xl z-10">
                  <span>{stage}</span>
                  <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{cards.length}</span>
                </div>
                <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                  {cards.map(card => (
                    <Card key={card.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                         <span className="font-bold text-slate-800">{card.leadName}</span>
                         <span className="text-xs font-semibold text-emerald-600">R$ {card.value.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-slate-500 mb-3">{card.title} @ {card.company}</div>
                      <div className="flex items-center gap-1 mb-3">
                        {card.channels.map(c => <ChannelBadge key={c} channel={c} size="sm" />)}
                      </div>
                      <div className="pt-3 border-t border-slate-100 text-xs flex justify-between items-center text-slate-500 dark:text-slate-400 dark:text-slate-500">
                         <span>{card.cadenceStatus}</span>
                         <span className="bg-white px-2 py-1 rounded border border-slate-200 dark:border-slate-700">{card.nextActivity}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const InboxView = () => {
  const { leads, loading } = useData();

  if (loading) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center animate-in fade-in duration-500 bg-white rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading inbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex animate-in fade-in duration-500 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Sidebar List */}
      <div className="w-80 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-slate-900 mb-4">Unified Inbox</h2>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={14} />
             <Input placeholder="Search messages..." className="pl-9 h-9 text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {leads.slice(0, 5).map((lead: any, i: number) => (
             <div key={lead.id} className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${i === 0 ? 'bg-blue-50/50 border-l-2 border-l-blue-500' : ''}`}>
                <div className="flex justify-between items-start mb-1">
                   <span className="font-semibold text-slate-900 text-sm">{lead.name}</span>
                   <span className="text-xs text-slate-400 dark:text-slate-500">10:42 AM</span>
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                   <ChannelBadge channel={lead.channels[0]} size="sm" />
                   <span className="text-xs text-slate-500 truncate">RE: Project collaboration proposal</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">
                   Hi Marcos, thanks for reaching out. I'd be interested in hearing more about your services...
                </p>
             </div>
          ))}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500">JS</div>
              <div>
                 <h3 className="font-bold text-slate-900 dark:text-white">Joao Silva</h3>
                 <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">CEO @ TechCorp • 3 active deals</p>
              </div>
           </div>
           <div className="flex gap-2">
              <Button variant="outline" className="h-8 text-xs">View Lead</Button>
              <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal size={16}/></Button>
           </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
           <div className="flex justify-center">
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Today</span>
           </div>
           
           <div className="flex justify-end">
              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-md text-sm shadow-sm">
                 <p>Hi Joao, saw your recent post about expansion into the BR market. We help companies scale their sales teams efficiently. Would you be open to a quick chat?</p>
                 <div className="flex justify-end items-center gap-1 mt-1 opacity-70 text-[10px]">
                    <span>10:30 AM</span>
                    <CheckCircle2 size={10} />
                 </div>
              </div>
           </div>

           <div className="flex justify-start">
              <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md text-sm shadow-sm">
                 <p>Hi Marcos, thanks for reaching out. I'd be interested in hearing more about your services. Do you have any case studies?</p>
                 <div className="flex justify-end mt-1 text-slate-400 text-[10px]">
                    <span>10:42 AM</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-200 dark:border-slate-700">
           <div className="flex gap-2 mb-2">
              <button className="text-xs font-medium text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors">Generate Reply (AI)</button>
              <button className="text-xs font-medium text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors">Schedule Meeting</button>
           </div>
           <div className="flex gap-2">
              <Input placeholder="Type a message..." className="flex-1" />
              <Button className="w-12 h-10 p-0 flex items-center justify-center"><ArrowUpRight size={18} /></Button>
           </div>
        </div>
      </div>
    </div>
  );
};

const AccountsView = () => {
  const { accounts, loading } = useData();

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Connected Accounts</h1>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Manage your social profiles and communication channels</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading accounts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Connected Accounts</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Manage your social profiles and communication channels</p>
        </div>
        <Button><Plus size={16}/> Connect Account</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account: any) => (
          <Card key={account.id} className="p-6 relative overflow-hidden group hover:shadow-lg transition-all">
             <div className="flex items-center gap-4 mb-4 relative z-10">
                <ChannelBadge channel={account.platform} size="md" />
                <div>
                   <h3 className="font-bold text-slate-900 dark:text-white">{account.name}</h3>
                   <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`w-2 h-2 rounded-full ${account.status === 'Connected' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{account.status}</span>
                   </div>
                </div>
             </div>

             <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-sm">
                   <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Daily Usage</span>
                   <span className="font-bold text-slate-700 dark:text-slate-200">{account.usage}/{account.limit}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                   <div className={`h-full rounded-full ${account.usage > 90 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(account.usage / account.limit) * 100}%` }}></div>
                </div>
                <div className="pt-4 flex gap-2">
                   <Button variant="outline" className="flex-1 text-xs h-8">Settings</Button>
                   <Button variant="ghost" className="text-xs h-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600">Reconnect</Button>
                </div>
             </div>
          </Card>
        ))}

        <Card className="border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer min-h-[200px]">
           <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3">
              <Plus size={24} className="text-slate-400 dark:text-slate-500" />
           </div>
           <h3 className="font-bold text-slate-700 dark:text-slate-200">Add Account</h3>
           <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px]">Connect LinkedIn, Instagram, WhatsApp or Email accounts</p>
        </Card>
      </div>
    </div>
  );
};

const ICPAnalyzerView = () => {
  const icpCriteria = [
    { name: 'Company Size', weight: 25, score: 85 },
    { name: 'Industry Match', weight: 20, score: 92 },
    { name: 'Decision Maker', weight: 20, score: 78 },
    { name: 'Budget Potential', weight: 15, score: 65 },
    { name: 'Tech Stack Fit', weight: 10, score: 88 },
    { name: 'Geographic Match', weight: 10, score: 95 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ICP Analyzer</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Analyze and optimize your Ideal Customer Profile</p>
        </div>
        <Button><Sparkles size={16}/> Recalculate All</Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-slate-500 mb-1">Average ICP Score</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">76.4</div>
          <div className="text-sm text-emerald-600 flex items-center gap-1 mt-1">
            <ArrowUpRight size={14}/> +3.2 vs last month
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-slate-500 mb-1">High Fit Leads</div>
          <div className="text-3xl font-bold text-emerald-600">165</div>
          <div className="text-sm text-slate-500 mt-1">Score 80+</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-slate-500 mb-1">Medium Fit</div>
          <div className="text-3xl font-bold text-amber-600">410</div>
          <div className="text-sm text-slate-500 mt-1">Score 60-79</div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-slate-500 mb-1">Low Fit</div>
          <div className="text-3xl font-bold text-red-600">137</div>
          <div className="text-sm text-slate-500 mt-1">Score below 60</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ICP Criteria */}
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Target size={18} className="text-blue-600"/> ICP Criteria & Performance
          </h3>
          <div className="space-y-4">
            {icpCriteria.map((criteria, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white">{criteria.name}</span>
                    <Badge color="gray">{criteria.weight}%</Badge>
                  </div>
                  <span className={`font-bold ${criteria.score >= 80 ? 'text-emerald-600' : criteria.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                    {criteria.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${criteria.score >= 80 ? 'bg-emerald-500' : criteria.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${criteria.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="outline" className="w-full">
              <Settings size={16} className="mr-2"/> Adjust ICP Weights
            </Button>
          </div>
        </Card>

        {/* Score Distribution */}
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-600"/> Score Distribution
          </h3>
          <div className="space-y-3">
            {[
              { range: '90-100', count: 45, color: 'bg-emerald-500' },
              { range: '80-89', count: 120, color: 'bg-emerald-400' },
              { range: '70-79', count: 230, color: 'bg-amber-400' },
              { range: '60-69', count: 180, color: 'bg-amber-500' },
              { range: '<60', count: 137, color: 'bg-red-500' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="w-16 text-sm font-medium text-slate-600 dark:text-slate-300">{item.range}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full flex items-center justify-end pr-3`}
                    style={{ width: `${(item.count / 230) * 100}%` }}
                  >
                    <span className="text-white text-xs font-bold">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="text-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mx-auto mb-1"></div>
              <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">High Fit</div>
              <div className="text-sm font-bold">23%</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mx-auto mb-1"></div>
              <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Medium</div>
              <div className="text-sm font-bold">58%</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
              <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Low Fit</div>
              <div className="text-sm font-bold">19%</div>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="p-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-purple-600"/> AI Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
            <div className="text-emerald-700 font-bold text-sm mb-2">Top Performing Segment</div>
            <p className="text-sm text-emerald-800">CEOs in Tech companies (51-200 employees) in Sao Paulo have 92% ICP match rate.</p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
            <div className="text-amber-700 font-bold text-sm mb-2">Improvement Opportunity</div>
            <p className="text-sm text-amber-800">Consider increasing weight for "Decision Maker" criteria - leads with direct authority convert 2.3x better.</p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="text-blue-700 font-bold text-sm mb-2">New Segment Detected</div>
            <p className="text-sm text-blue-800">Healthcare CTOs showing high engagement. Consider adding as ICP segment.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

const AnalyticsView = () => {
  const channelMetrics = [
    { channel: 'linkedin', sent: 450, responses: 85, rate: 18.9 },
    { channel: 'instagram', sent: 320, responses: 48, rate: 15.0 },
    { channel: 'whatsapp', sent: 280, responses: 112, rate: 40.0 },
    { channel: 'email', sent: 890, responses: 89, rate: 10.0 },
    { channel: 'phone', sent: 120, responses: 36, rate: 30.0 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Performance metrics and insights</p>
        </div>
        <div className="flex gap-2">
          <select className="h-10 px-4 bg-white border border-slate-200 rounded-lg text-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
          <Button variant="outline"><FileText size={16}/> Export Report</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Outreach', value: '2,060', change: '+18%' },
          { label: 'Response Rate', value: '18.2%', change: '+2.4%' },
          { label: 'Meetings Booked', value: '48', change: '+12' },
          { label: 'Show Rate', value: '78%', change: '+5%' },
          { label: 'Conversion', value: '12.5%', change: '+1.2%' },
        ].map((metric, idx) => (
          <Card key={idx} className="p-4">
            <div className="text-sm text-slate-500 mb-1">{metric.label}</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{metric.value}</div>
            <div className="text-xs font-medium text-emerald-600 mt-1">{metric.change}</div>
          </Card>
        ))}
      </div>

      {/* Channel Performance Table */}
      <Card className="p-6">
        <h3 className="font-bold text-slate-900 mb-6">Channel Performance</h3>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Channel</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Messages Sent</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Responses</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Response Rate</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {channelMetrics.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <ChannelBadge channel={row.channel as Channel} size="sm" />
                    <span className="font-medium capitalize">{row.channel}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{row.sent}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{row.responses}</td>
                <td className="px-4 py-4">
                  <span className={`font-bold ${row.rate >= 30 ? 'text-emerald-600' : row.rate >= 15 ? 'text-amber-600' : 'text-slate-600'}`}>
                    {row.rate}%
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="w-20 bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${row.rate >= 30 ? 'bg-emerald-500' : row.rate >= 15 ? 'bg-amber-500' : 'bg-slate-400'}`}
                      style={{ width: `${(row.rate / 50) * 100}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Conversion Funnel */}
      <Card className="p-6">
        <h3 className="font-bold text-slate-900 mb-6">Conversion Funnel</h3>
        <div className="flex items-end justify-between gap-4 h-48">
          {[
            { label: 'Leads', value: 1247, percent: 100, color: 'bg-blue-500' },
            { label: 'Contacted', value: 892, percent: 71, color: 'bg-blue-400' },
            { label: 'Responded', value: 187, percent: 15, color: 'bg-emerald-400' },
            { label: 'Meeting', value: 48, percent: 4, color: 'bg-emerald-500' },
            { label: 'Won', value: 12, percent: 1, color: 'bg-emerald-600' },
          ].map((step, idx) => (
            <div key={idx} className="flex-1 text-center">
              <div
                className={`${step.color} rounded-t-lg flex items-end justify-center pb-2 mx-auto w-full max-w-[80px]`}
                style={{ height: `${Math.max(40, step.percent * 1.5)}px` }}
              >
                <span className="text-white font-bold text-sm">{step.value}</span>
              </div>
              <p className="text-sm font-medium text-slate-900 mt-2">{step.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{step.percent}%</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Best Performing Day</h3>
          <div className="text-4xl font-bold text-blue-600 mb-2">Tuesday</div>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">32% higher response rate than average</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Best Performing Time</h3>
          <div className="text-4xl font-bold text-blue-600 mb-2">10:00 AM</div>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Peak engagement window: 9-11 AM</p>
        </Card>
      </div>
    </div>
  );
};

const IntegrationsView = () => {
  const integrations = [
    { id: '1', name: 'GoHighLevel', desc: 'CRM and marketing automation', color: 'bg-orange-500', status: 'connected', features: ['Contacts Sync', 'Pipeline', 'Automations'] },
    { id: '2', name: 'Supabase', desc: 'Database and authentication', color: 'bg-emerald-500', status: 'connected', features: ['Lead Storage', 'Auth', 'Real-time'] },
    { id: '3', name: 'n8n', desc: 'Workflow automation platform', color: 'bg-red-500', status: 'connected', features: ['Workflows', 'Triggers', 'Actions'] },
    { id: '4', name: 'Zapier', desc: 'Connect with 5,000+ apps', color: 'bg-orange-400', status: 'available', features: ['App Connections', 'Zaps'] },
    { id: '5', name: 'Google Calendar', desc: 'Calendar sync for meetings', color: 'bg-blue-500', status: 'available', features: ['Event Sync', 'Availability'] },
    { id: '6', name: 'Webhooks', desc: 'Custom webhook endpoints', color: 'bg-purple-500', status: 'available', features: ['Inbound', 'Outbound'] },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Integrations</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Connect Socialfy with your favorite tools</p>
        </div>
        <Button><Plus size={16}/> Request Integration</Button>
      </div>

      {/* Connected Integrations */}
      <div>
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600"/> Connected
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrations.filter(i => i.status === 'connected').map(integration => (
            <Card key={integration.id} className="p-6 border-l-4 border-l-emerald-500">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-white`}>
                  <Plug size={24} />
                </div>
                <Badge color="green">Connected</Badge>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{integration.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{integration.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {integration.features.map(f => (
                  <span key={f} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{f}</span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-xs h-8">Configure</Button>
                <Button variant="ghost" className="text-xs h-8 text-red-500 hover:text-red-600 hover:bg-red-50">Disconnect</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Integrations */}
      <div>
        <h3 className="font-bold text-slate-900 mb-4">Available</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrations.filter(i => i.status === 'available').map(integration => (
            <Card key={integration.id} className="p-6 opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center text-white opacity-60`}>
                  <Plug size={24} />
                </div>
                <Badge color="gray">Available</Badge>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{integration.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{integration.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {integration.features.map(f => (
                  <span key={f} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{f}</span>
                ))}
              </div>
              <Button className="w-full text-sm">Connect</Button>
            </Card>
          ))}
        </div>
      </div>

      {/* API Section */}
      <Card className="p-6 bg-slate-900 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center">
            <Webhook size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg">Socialfy API</h3>
            <p className="text-slate-400 text-sm">Build custom integrations with our REST API</p>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm mb-4 flex items-center justify-between">
          <span><span className="text-slate-400 dark:text-slate-500">API Key:</span> sk_live_••••••••••••••••</span>
          <button className="text-blue-400 hover:text-blue-300 text-xs">Copy</button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-white border-slate-700 hover:bg-slate-800">
            <FileText size={16} className="mr-2"/> API Docs
          </Button>
          <Button variant="outline" className="text-white border-slate-700 hover:bg-slate-800">
            Regenerate Key
          </Button>
        </div>
      </Card>
    </div>
  );
};

const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Settings Sidebar */}
        <div className="w-64 space-y-1">
          {[
            { id: 'profile', label: 'Profile', icon: Users },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'billing', label: 'Billing & Plan', icon: DollarSign },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card className="p-6">
              <h3 className="font-bold text-lg text-slate-900 mb-6">Profile Settings</h3>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-2xl font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  MD
                </div>
                <div>
                  <Button variant="outline" className="text-sm">Change Photo</Button>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG max 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</label>
                  <Input defaultValue="Marcos Daniels" className="bg-white dark:bg-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                  <Input defaultValue="marcos@mottivme.com" className="bg-white dark:bg-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Company</label>
                  <Input defaultValue="Mottivme" className="bg-white dark:bg-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Role</label>
                  <Input defaultValue="Founder & CEO" className="bg-white dark:bg-slate-800" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Timezone</label>
                  <select className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-slate-900 dark:text-white">
                    <option>America/Sao_Paulo (GMT-3)</option>
                    <option>America/New_York (GMT-5)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h3 className="font-bold text-lg text-slate-900 mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'New lead responses', desc: 'Get notified when leads respond', email: true, push: true },
                  { label: 'Meeting reminders', desc: 'Reminders before scheduled meetings', email: true, push: true },
                  { label: 'Cadence completions', desc: 'When a cadence finishes for a lead', email: false, push: true },
                  { label: 'Daily summary', desc: 'Daily digest of your activities', email: true, push: false },
                  { label: 'Weekly report', desc: 'Weekly performance report', email: true, push: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked={item.email} className="rounded text-blue-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">Email</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked={item.push} className="rounded text-blue-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">Push</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="p-6">
              <h3 className="font-bold text-lg text-slate-900 mb-6">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-slate-100">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Change Password</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline">Change</Button>
                </div>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Active Sessions</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">2 devices currently logged in</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge color="yellow" className="mb-2">PRO PLAN</Badge>
                    <h3 className="text-2xl font-bold mb-1">R$ 297/month</h3>
                    <p className="text-blue-100">Billed monthly • Renews Dec 15</p>
                  </div>
                  <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                    Upgrade Plan
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Usage This Month</h3>
                <div className="space-y-4">
                  {[
                    { label: 'LinkedIn Searches', used: 850, limit: 1000 },
                    { label: 'Instagram Searches', used: 320, limit: 500 },
                    { label: 'AI Agent Credits', used: 2400, limit: 5000 },
                    { label: 'Team Members', used: 3, limit: 5 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                        <span className="font-medium">{item.used} / {item.limit}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${(item.used / item.limit) > 0.8 ? 'bg-amber-500' : 'bg-blue-500'}`}
                          style={{ width: `${(item.used / item.limit) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Layout & Nav ---

const SidebarSection = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{title}</h3>
    <div className="space-y-0.5">{children}</div>
  </div>
);

const Sidebar = ({ active, onNavigate, isOpen, onClose }: { active: NavItem, onNavigate: (i: NavItem) => void, isOpen?: boolean, onClose?: () => void }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const NavButton = ({ id, icon, label }: { id: NavItem, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => {
        onNavigate(id);
        if (onClose) onClose();
      }}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active === id
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col fixed left-0 top-0 z-50 overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <div>
               <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight block leading-none">Socialfy</span>
               <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Sales Intelligence</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2">
          <SidebarSection title={t('section.prospecting')}>
            <NavButton id="dashboard" icon={<LayoutDashboard size={18} />} label={t('nav.dashboard')} />
            <NavButton id="leads" icon={<Users size={18} />} label={t('nav.leads')} />
            <div className="pl-6 space-y-0.5">
              <NavButton id="linkedin-search" icon={<span className="text-[#0A66C2] font-bold">in</span>} label={t('nav.linkedin_search')} />
              <NavButton id="instagram-search" icon={<Instagram size={16} className="text-pink-500" />} label={t('nav.instagram_search')} />
              <NavButton id="cnpj-search" icon={<Briefcase size={16} className="text-amber-500" />} label={t('nav.cnpj_search')} />
            </div>
            <NavButton id="campaigns" icon={<Megaphone size={18} />} label={t('nav.campaigns')} />
          </SidebarSection>

          <SidebarSection title={t('section.cadences')}>
             <NavButton id="cadence-builder" icon={<Workflow size={18} />} label={t('nav.cadence_builder')} />
             <NavButton id="active-cadences" icon={<PlayCircle size={18} />} label={t('nav.active_cadences')} />
             <NavButton id="show-rate" icon={<Shield size={18} />} label={t('nav.show_rate')} />
          </SidebarSection>

          <SidebarSection title={t('section.engagement')}>
             <NavButton id="pipeline" icon={<Kanban size={18} />} label={t('nav.pipeline')} />
             <NavButton id="inbox" icon={<Inbox size={18} />} label={t('nav.inbox')} />
             <NavButton id="content" icon={<FileText size={18} />} label={t('nav.content')} />
          </SidebarSection>

          <SidebarSection title={t('section.intelligence')}>
             <NavButton id="agents" icon={<Bot size={18} />} label={t('nav.agents')} />
             <NavButton id="icp" icon={<Target size={18} />} label={t('nav.icp')} />
             <NavButton id="analytics" icon={<BarChart3 size={18} />} label={t('nav.analytics')} />
          </SidebarSection>

          <SidebarSection title={t('section.configuration')}>
             <NavButton id="accounts" icon={<LinkIcon size={18} />} label={t('nav.accounts')} />
             <NavButton id="integrations" icon={<Plug size={18} />} label={t('nav.integrations')} />
             <NavButton id="settings" icon={<Settings size={18} />} label={t('nav.settings')} />
          </SidebarSection>
        </nav>

        {/* Theme & Language Toggles */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-1"
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-yellow-500" />}
              <span className="text-xs">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-1"
              title={language === 'pt' ? 'English' : 'Português'}
            >
              <Globe size={18} />
              <span className="text-xs font-bold">{language.toUpperCase()}</span>
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500">MD</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">Marcos Daniels</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Mottivme</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </div>
    </>
  );
};

const AgentsView = () => {
  const { agents, loading } = useData();

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Agents</h1>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Configure your autonomous workforce</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading agents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Agents</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Configure your autonomous workforce</p>
        </div>
        <Button><Plus size={16}/> New Agent</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent: any) => (
          <Card key={agent.id} className="p-6 border-t-4 border-t-blue-500 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Bot size={28} />
              </div>
              <Badge color={agent.isActive ? 'green' : 'gray'}>{agent.isActive ? 'Active' : 'Inactive'}</Badge>
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{agent.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{agent.type} • {agent.model}</p>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4 h-20 overflow-hidden">
              "{agent.description}"
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1 text-xs">Edit</Button>
              <Button variant="outline" className="flex-1 text-xs">Test</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [currentView, setCurrentView] = useState<NavItem>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar
        active={currentView}
        onNavigate={setCurrentView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="lg:ml-64 p-4 md:p-6 lg:p-8">
        <header className="flex justify-between items-center mb-6 md:mb-8 gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>

          {/* Search - hidden on mobile, visible on tablet+ */}
          <div className="relative hidden md:block flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input
              type="text"
              placeholder={t('common.search_full')}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 shadow-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>

          {/* Mobile logo - shown only on mobile */}
          <div className="lg:hidden flex items-center gap-2 flex-1 justify-center md:hidden">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">Socialfy</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors hidden md:block">
              <HelpCircle size={20} />
            </button>
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl dark:shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t('common.notifications')}</h3>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">{t('common.mark_all_read')}</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {[
                      { title: 'New response from Joao Silva', time: '2 min ago', type: 'message' },
                      { title: 'Meeting tomorrow at 10:00 AM', time: '1 hour ago', type: 'calendar' },
                      { title: 'Cadence "Tech CEOs" completed', time: '3 hours ago', type: 'alert' },
                    ].map((n, i) => (
                      <div key={i} className="p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex gap-3 last:border-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'message' ? 'bg-blue-500' : n.type === 'calendar' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{n.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Search - visible only on mobile */}
        <div className="relative md:hidden mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            placeholder={t('common.search')}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 shadow-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'leads' && <LeadsView />}
        {currentView === 'cadence-builder' && <CadenceBuilderView />}
        {currentView === 'pipeline' && <PipelineView />}
        {currentView === 'inbox' && <InboxView />}
        {currentView === 'accounts' && <AccountsView />}
        {currentView === 'instagram-search' && <InstagramSearchView />}
        {currentView === 'linkedin-search' && <LinkedInSearchView />}
        {currentView === 'cnpj-search' && <CNPJSearchView />}
        {currentView === 'active-cadences' && <ActiveCadencesView />}
        {currentView === 'show-rate' && <ShowRateGuardView />}
        {currentView === 'campaigns' && <CampaignsView />}
        {currentView === 'content' && <ContentStudioView />}
        {currentView === 'icp' && <ICPAnalyzerView />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'integrations' && <IntegrationsView />}
        {currentView === 'settings' && <SettingsView />}
        
        {/* Agents View */}
        {currentView === 'agents' && <AgentsView />}

        {/* Placeholders for other views */}
        {(!['dashboard', 'leads', 'cadence-builder', 'pipeline', 'inbox', 'accounts', 'agents', 'instagram-search', 'linkedin-search', 'cnpj-search', 'active-cadences', 'show-rate', 'campaigns', 'content', 'icp', 'analytics', 'integrations', 'settings'].includes(currentView)) && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
             <div className="bg-white p-6 rounded-full mb-4 text-blue-500 shadow-sm">
                <Workflow size={48} />
             </div>
             <h2 className="text-xl font-bold text-slate-900 mb-2 capitalize">{currentView.replace('-', ' ')}</h2>
             <p className="text-slate-500 max-w-md">
               This module is under development for Socialfy V2. 
               Please check Cadence Builder, Lead Intelligence, or Unified Inbox for main features.
             </p>
          </div>
        )}
      </main>
    </div>
  );
}