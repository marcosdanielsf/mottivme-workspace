/**
 * GoHighLevel Pricing Data Models and Constants
 *
 * This file contains comprehensive pricing information for GoHighLevel services,
 * including core plans, usage-based services, add-ons, and AI employees.
 *
 * Last Updated: 2025-12-10
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Billing frequency for plans and services
 */
export type BillingFrequency = 'monthly' | 'yearly' | 'one-time' | 'usage';

/**
 * Plan tier levels
 */
export type PlanTier = 'starter' | 'unlimited' | 'pro';

/**
 * Unit types for usage-based pricing
 */
export type UsageUnit =
  | 'per_month'
  | 'per_minute'
  | 'per_segment'
  | 'per_email'
  | 'per_1000_emails'
  | 'per_1000_verifications'
  | 'per_message'
  | 'per_review'
  | 'per_image'
  | 'per_1000_words'
  | 'per_execution'
  | 'one_time';

/**
 * Core plan interface with all plan details
 */
export interface Plan {
  /** Unique identifier for the plan */
  id: PlanTier;
  /** Display name of the plan */
  name: string;
  /** Short description of the plan */
  description: string;
  /** Monthly price in USD */
  monthlyPrice: number;
  /** Annual price in USD (if available) */
  yearlyPrice: number;
  /** Savings amount when paying yearly */
  yearlySavings: number;
  /** Number of sub-accounts included (null for unlimited) */
  subAccounts: number | null;
  /** Array of feature descriptions */
  features: string[];
  /** Can rebill services at cost */
  rebillingAtCost: boolean;
  /** Can rebill services with markup */
  rebillingWithMarkup: boolean;
  /** SaaS mode enabled */
  saasMode: boolean;
  /** Recommended for certain use cases */
  recommended?: boolean;
}

/**
 * Usage-based service pricing
 */
export interface UsageService {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Service category */
  category: 'phone' | 'email' | 'ai' | 'workflow' | 'messaging';
  /** Price per unit */
  rate: number;
  /** Unit of measurement */
  unit: UsageUnit;
  /** Description of the service */
  description: string;
  /** Can be rebilled to clients */
  rebillable: boolean;
  /** Can add markup when rebilling */
  markupAllowed: boolean;
  /** Minimum plan tier required */
  minimumPlan?: PlanTier;
  /** Additional notes or conditions */
  notes?: string;
}

/**
 * Fixed-price add-on services
 */
export interface AddOnService {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Service category */
  category: 'phone' | 'email' | 'compliance' | 'hosting' | 'messaging' | 'marketing' | 'app' | 'ai';
  /** Monthly price */
  monthlyPrice?: number;
  /** Annual price (if different from monthly * 12) */
  yearlyPrice?: number;
  /** Semi-annual price option */
  semiAnnualPrice?: number;
  /** One-time fee */
  oneTimePrice?: number;
  /** Description of the service */
  description: string;
  /** Per sub-account pricing */
  perSubAccount: boolean;
  /** Minimum plan tier required */
  minimumPlan?: PlanTier;
  /** Additional features or notes */
  features?: string[];
  /** Additional notes */
  notes?: string;
}

/**
 * Carrier-specific fees
 */
export interface CarrierFee {
  /** Carrier name */
  carrier: string;
  /** Fee per SMS segment */
  feePerSegment: number;
  /** Additional notes */
  notes?: string;
}

/**
 * A2P Registration options
 */
export interface A2PRegistration {
  /** Registration type */
  type: 'low_volume' | 'high_volume';
  /** Display name */
  name: string;
  /** One-time registration fee */
  oneTimeFee: number;
  /** Monthly campaign fee */
  monthlyCampaignFee: number;
  /** Description */
  description: string;
}

/**
 * Workflow premium tier
 */
export interface WorkflowTier {
  /** Tier identifier */
  id: string;
  /** Display name */
  name: string;
  /** Monthly price (0 for free tier) */
  monthlyPrice: number;
  /** Number of executions included */
  executionsIncluded: number;
  /** Is this a lifetime allocation */
  lifetime: boolean;
  /** Description */
  description: string;
}

/**
 * SaaS client pricing tier (for Pro/SaaS plan)
 */
export interface ClientTier {
  /** Tier identifier */
  id: string;
  /** Display name */
  name: string;
  /** Suggested monthly price to charge clients */
  suggestedPrice: number;
  /** Your cost (what you pay GHL) */
  cost: number;
  /** Margin per client */
  margin: number;
  /** Features included at this tier */
  features: string[];
  /** Description */
  description: string;
}

// ============================================================================
// CORE PLANS
// ============================================================================

/**
 * GoHighLevel core subscription plans
 */
export const CORE_PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter Account',
    description: 'Perfect for small agencies or businesses getting started',
    monthlyPrice: 97,
    yearlyPrice: 970,
    yearlySavings: 194,
    subAccounts: 3,
    features: [
      'Up to 3 sub-accounts',
      'Unlimited contacts',
      'Unlimited calendars',
      'Email & SMS marketing',
      'CRM & Pipeline management',
      'Workflows & Automations',
      'Landing pages & Funnels',
      'Membership sites',
      'Reputation management',
      'Opportunities & Proposals',
      'Invoicing & Payments',
      'Community support',
    ],
    rebillingAtCost: false,
    rebillingWithMarkup: false,
    saasMode: false,
  },
  {
    id: 'unlimited',
    name: 'Unlimited Account',
    description: 'For growing agencies managing multiple clients',
    monthlyPrice: 297,
    yearlyPrice: 2970,
    yearlySavings: 594,
    subAccounts: null,
    features: [
      'Unlimited sub-accounts',
      'All Starter features',
      'Rebilling at cost',
      'Client billing portal',
      'White label desktop app',
      'White label mobile app',
      'Custom domain',
      'API access',
      'Custom webhooks',
      'Priority support',
    ],
    rebillingAtCost: true,
    rebillingWithMarkup: false,
    saasMode: false,
    recommended: true,
  },
  {
    id: 'pro',
    name: 'Pro / SaaS Account',
    description: 'For established agencies building their own SaaS platform',
    monthlyPrice: 497,
    yearlyPrice: 4970,
    yearlySavings: 994,
    subAccounts: null,
    features: [
      'Unlimited sub-accounts',
      'All Unlimited features',
      'Rebilling with markup',
      'SaaS mode configurator',
      'Custom pricing tiers',
      'Advanced API access',
      'Dedicated IP for email (available)',
      'Priority + account manager',
      'Custom integrations support',
    ],
    rebillingAtCost: true,
    rebillingWithMarkup: true,
    saasMode: true,
  },
];

// ============================================================================
// LC PHONE PRICING (US/CANADA)
// ============================================================================

/**
 * Phone number subscription fees
 */
export const PHONE_NUMBERS: AddOnService[] = [
  {
    id: 'local_number',
    name: 'Local Phone Number',
    category: 'phone',
    monthlyPrice: 1.15,
    description: 'Local phone number for US/Canada',
    perSubAccount: false,
  },
  {
    id: 'toll_free_number',
    name: 'Toll-Free Phone Number',
    category: 'phone',
    monthlyPrice: 2.15,
    description: 'Toll-free phone number (1-800, 1-888, etc.)',
    perSubAccount: false,
  },
];

/**
 * SMS and MMS usage rates
 */
export const MESSAGING_RATES: UsageService[] = [
  {
    id: 'sms_outbound',
    name: 'SMS (Outbound)',
    category: 'messaging',
    rate: 0.0083,
    unit: 'per_segment',
    description: 'Outbound SMS messages (160 characters per segment)',
    rebillable: true,
    markupAllowed: true,
  },
  {
    id: 'mms_outbound',
    name: 'MMS (Outbound)',
    category: 'messaging',
    rate: 0.022,
    unit: 'per_segment',
    description: 'Outbound MMS messages with media',
    rebillable: true,
    markupAllowed: true,
  },
  {
    id: 'mms_inbound',
    name: 'MMS (Inbound)',
    category: 'messaging',
    rate: 0.0165,
    unit: 'per_segment',
    description: 'Inbound MMS messages with media',
    rebillable: true,
    markupAllowed: true,
  },
];

/**
 * Voice call rates
 */
export const CALL_RATES: UsageService[] = [
  {
    id: 'call_outbound',
    name: 'Outbound Calls',
    category: 'phone',
    rate: 0.0166,
    unit: 'per_minute',
    description: 'Outbound voice calls',
    rebillable: true,
    markupAllowed: true,
  },
  {
    id: 'call_inbound',
    name: 'Inbound Calls',
    category: 'phone',
    rate: 0.01165,
    unit: 'per_minute',
    description: 'Inbound voice calls',
    rebillable: true,
    markupAllowed: true,
  },
  {
    id: 'voicemail_drop',
    name: 'Voicemail Drops',
    category: 'phone',
    rate: 0.018,
    unit: 'per_minute',
    description: 'Pre-recorded voicemail delivery',
    rebillable: true,
    markupAllowed: true,
  },
  {
    id: 'call_recording',
    name: 'Call Recording',
    category: 'phone',
    rate: 0.0025,
    unit: 'per_minute',
    description: 'Call recording service',
    rebillable: true,
    markupAllowed: true,
  },
  {
    id: 'call_transcription',
    name: 'Call Transcription',
    category: 'phone',
    rate: 0.024,
    unit: 'per_minute',
    description: 'AI-powered call transcription',
    rebillable: true,
    markupAllowed: true,
  },
];

/**
 * A2P (Application-to-Person) registration options
 */
export const A2P_REGISTRATION: A2PRegistration[] = [
  {
    type: 'low_volume',
    name: 'Low Volume A2P Registration',
    oneTimeFee: 24.50,
    monthlyCampaignFee: 11.025,
    description: 'For businesses sending fewer messages, standard registration',
  },
  {
    type: 'high_volume',
    name: 'High Volume A2P Registration',
    oneTimeFee: 71.91,
    monthlyCampaignFee: 11.025,
    description: 'For high-volume messaging, includes premium features',
  },
];

/**
 * Carrier-specific fees per SMS
 */
export const CARRIER_FEES: CarrierFee[] = [
  {
    carrier: 'AT&T',
    feePerSegment: 0.003,
    notes: 'Applied to all messages sent to AT&T numbers',
  },
  {
    carrier: 'T-Mobile',
    feePerSegment: 0.003,
    notes: 'Applied to all messages sent to T-Mobile numbers',
  },
  {
    carrier: 'Verizon',
    feePerSegment: 0.004,
    notes: 'Base rate for Verizon, may be up to $0.0065 for certain plans',
  },
];

// ============================================================================
// EMAIL PRICING
// ============================================================================

/**
 * Email service pricing
 */
export const EMAIL_SERVICES: UsageService[] = [
  {
    id: 'lc_email',
    name: 'LC Email',
    category: 'email',
    rate: 0.675,
    unit: 'per_1000_emails',
    description: 'Email sending service ($0.000675 per email)',
    rebillable: true,
    markupAllowed: true,
  },
  {
    id: 'email_verification',
    name: 'Email Verification',
    category: 'email',
    rate: 2.50,
    unit: 'per_1000_verifications',
    description: 'Email address verification service',
    rebillable: true,
    markupAllowed: true,
  },
];

/**
 * Email add-ons
 */
export const EMAIL_ADDONS: AddOnService[] = [
  {
    id: 'dedicated_ip',
    name: 'Dedicated IP Address',
    category: 'email',
    monthlyPrice: 59,
    description: 'Dedicated IP for email sending (improves deliverability)',
    perSubAccount: false,
    minimumPlan: 'pro',
    features: [
      'Dedicated IP address',
      'Improved email deliverability',
      'Custom IP reputation',
      'Required for high-volume senders',
    ],
  },
];

// ============================================================================
// AI EMPLOYEE PRICING
// ============================================================================

/**
 * AI Employee services and pricing
 */
export const AI_SERVICES: UsageService[] = [
  {
    id: 'voice_ai_engine',
    name: 'Voice AI (Engine)',
    category: 'ai',
    rate: 0.06,
    unit: 'per_minute',
    description: 'Voice AI engine cost (plus LLM token costs)',
    rebillable: true,
    markupAllowed: true,
    notes: 'Additional LLM token costs apply based on usage',
  },
  {
    id: 'conversation_ai',
    name: 'Conversation AI',
    category: 'ai',
    rate: 0.02,
    unit: 'per_message',
    description: 'AI-powered conversation responses (promotional pricing)',
    rebillable: true,
    markupAllowed: true,
    notes: 'Maximum cost per message, promotional pricing',
  },
  {
    id: 'reviews_ai',
    name: 'Reviews AI',
    category: 'ai',
    rate: 0.01,
    unit: 'per_review',
    description: 'AI-generated review responses',
    rebillable: true,
    markupAllowed: true,
  },
  {
    id: 'content_ai_image',
    name: 'Content AI (Images)',
    category: 'ai',
    rate: 0.063,
    unit: 'per_image',
    description: 'AI-generated images',
    rebillable: true,
    markupAllowed: true,
  },
  {
    id: 'content_ai_text',
    name: 'Content AI (Text)',
    category: 'ai',
    rate: 0.0945,
    unit: 'per_1000_words',
    description: 'AI-generated text content',
    rebillable: true,
    markupAllowed: true,
  },
  {
    id: 'funnel_ai',
    name: 'Funnel AI',
    category: 'ai',
    rate: 0,
    unit: 'per_execution',
    description: 'AI-powered funnel builder (1000 prompts daily limit)',
    rebillable: false,
    markupAllowed: false,
    notes: 'Free with 1000 prompts per day limit',
  },
  {
    id: 'workflow_ai',
    name: 'Workflow AI',
    category: 'ai',
    rate: 0.01,
    unit: 'per_execution',
    description: 'AI actions within workflows',
    rebillable: true,
    markupAllowed: true,
  },
];

/**
 * AI Employee subscription (Unlimited plan)
 */
export const AI_EMPLOYEE_SUBSCRIPTION: AddOnService = {
  id: 'ai_employee_unlimited',
  name: 'AI Employee (Unlimited Plan)',
  category: 'ai',
  monthlyPrice: 97,
  description: 'AI Employee with unlimited features per sub-account',
  perSubAccount: true,
  features: [
    'Unlimited AI conversations',
    'Voice AI capabilities',
    'Review management',
    'Content generation',
    'Custom AI training',
  ],
};

// ============================================================================
// OTHER SERVICES
// ============================================================================

/**
 * WordPress hosting tiers
 */
export const WORDPRESS_HOSTING: AddOnService[] = [
  {
    id: 'wordpress_standard',
    name: 'WordPress Hosting (Standard)',
    category: 'hosting',
    monthlyPrice: 10,
    description: 'Standard WordPress hosting per site',
    perSubAccount: false,
  },
  {
    id: 'wordpress_25_sites',
    name: 'WordPress Hosting (25 Sites)',
    category: 'hosting',
    monthlyPrice: 220,
    description: 'WordPress hosting for up to 25 sites',
    perSubAccount: false,
  },
  {
    id: 'wordpress_unlimited',
    name: 'WordPress Hosting (Unlimited)',
    category: 'hosting',
    monthlyPrice: 497,
    description: 'Unlimited WordPress hosting',
    perSubAccount: false,
  },
];

/**
 * WhatsApp integration
 */
export const WHATSAPP_SERVICE: AddOnService = {
  id: 'whatsapp',
  name: 'WhatsApp Business Integration',
  category: 'messaging',
  monthlyPrice: 10,
  description: 'WhatsApp Business API integration (plus usage fees)',
  perSubAccount: true,
  notes: 'Additional usage fees apply for messages sent',
};

/**
 * Online listings (Yext integration)
 */
export const ONLINE_LISTINGS: AddOnService[] = [
  {
    id: 'listings_monthly',
    name: 'Online Listings (Monthly)',
    category: 'marketing',
    monthlyPrice: 30,
    description: 'Yext-powered online listings management',
    perSubAccount: true,
  },
  {
    id: 'listings_semiannual',
    name: 'Online Listings (6 Months)',
    category: 'marketing',
    semiAnnualPrice: 150,
    description: 'Yext-powered online listings management (6 months prepaid)',
    perSubAccount: true,
  },
  {
    id: 'listings_annual',
    name: 'Online Listings (Annual)',
    category: 'marketing',
    yearlyPrice: 300,
    description: 'Yext-powered online listings management (annual prepaid)',
    perSubAccount: true,
  },
];

/**
 * HIPAA compliance
 */
export const HIPAA_COMPLIANCE: AddOnService = {
  id: 'hipaa',
  name: 'HIPAA Compliance',
  category: 'compliance',
  monthlyPrice: 297,
  description: 'HIPAA-compliant infrastructure and BAA',
  perSubAccount: false,
  features: [
    'HIPAA-compliant infrastructure',
    'Business Associate Agreement (BAA)',
    'Encrypted data storage',
    'Audit logs',
    'Compliance documentation',
  ],
};

/**
 * Branded mobile app
 */
export const BRANDED_MOBILE_APP: AddOnService = {
  id: 'branded_app',
  name: 'Branded Mobile App',
  category: 'app',
  monthlyPrice: 49,
  description: 'White-label mobile app with your branding',
  perSubAccount: false,
  features: [
    'iOS and Android apps',
    'Custom branding',
    'App store listings',
    'Push notifications',
    'Ongoing updates',
  ],
};

// ============================================================================
// WORKFLOW PREMIUM TIERS
// ============================================================================

/**
 * Workflow premium execution tiers
 */
export const WORKFLOW_TIERS: WorkflowTier[] = [
  {
    id: 'free',
    name: 'Free Tier',
    monthlyPrice: 0,
    executionsIncluded: 100,
    lifetime: true,
    description: '100 workflow executions (lifetime allocation)',
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 10,
    executionsIncluded: 10000,
    lifetime: false,
    description: '10,000 workflow executions per month',
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 25,
    executionsIncluded: 30000,
    lifetime: false,
    description: '30,000 workflow executions per month',
  },
  {
    id: 'scale',
    name: 'Scale',
    monthlyPrice: 50,
    executionsIncluded: 65000,
    lifetime: false,
    description: '65,000 workflow executions per month',
  },
];

// ============================================================================
// SAAS CLIENT PRICING TIERS
// ============================================================================

/**
 * Example SaaS client pricing tiers (for Pro/SaaS plan users)
 * These are suggested pricing examples - actual pricing is configurable
 */
export const SAAS_CLIENT_TIERS: ClientTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    suggestedPrice: 197,
    cost: 0, // No additional cost per sub-account
    margin: 197,
    features: [
      'CRM & Pipeline',
      'Email marketing',
      'SMS marketing',
      'Basic automations',
      'Landing pages',
      'Calendars & bookings',
    ],
    description: 'Entry-level package for small businesses',
  },
  {
    id: 'professional',
    name: 'Professional',
    suggestedPrice: 297,
    cost: 0,
    margin: 297,
    features: [
      'All Basic features',
      'Advanced automations',
      'Membership sites',
      'Reputation management',
      'Invoicing & payments',
      'Priority support',
    ],
    description: 'Full-featured package for growing businesses',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    suggestedPrice: 497,
    cost: 0,
    margin: 497,
    features: [
      'All Professional features',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced reporting',
      'API access',
      'White-glove onboarding',
    ],
    description: 'Premium package for established businesses',
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get plan by ID
 */
export function getPlanById(id: PlanTier): Plan | undefined {
  return CORE_PLANS.find(plan => plan.id === id);
}

/**
 * Get usage service by ID
 */
export function getUsageServiceById(id: string): UsageService | undefined {
  const allUsageServices = [
    ...MESSAGING_RATES,
    ...CALL_RATES,
    ...EMAIL_SERVICES,
    ...AI_SERVICES,
  ];
  return allUsageServices.find(service => service.id === id);
}

/**
 * Get add-on service by ID
 */
export function getAddOnById(id: string): AddOnService | undefined {
  const allAddOns = [
    ...PHONE_NUMBERS,
    ...EMAIL_ADDONS,
    AI_EMPLOYEE_SUBSCRIPTION,
    ...WORDPRESS_HOSTING,
    WHATSAPP_SERVICE,
    ...ONLINE_LISTINGS,
    HIPAA_COMPLIANCE,
    BRANDED_MOBILE_APP,
  ];
  return allAddOns.find(addon => addon.id === id);
}

/**
 * Calculate yearly savings for a plan
 */
export function calculateYearlySavings(monthlyPrice: number, yearlyPrice: number): number {
  return (monthlyPrice * 12) - yearlyPrice;
}

/**
 * Calculate monthly cost per email (from per-1000 rate)
 */
export function calculateEmailCost(emails: number, ratePerThousand: number): number {
  return (emails / 1000) * ratePerThousand;
}

/**
 * Calculate SMS cost including carrier fees
 */
export function calculateSMSCost(
  segments: number,
  baseRate: number,
  carrierFee: number = 0.003
): number {
  return segments * (baseRate + carrierFee);
}

/**
 * Calculate A2P total first-month cost
 */
export function calculateA2PFirstMonthCost(
  registrationType: 'low_volume' | 'high_volume'
): number {
  const registration = A2P_REGISTRATION.find(r => r.type === registrationType);
  if (!registration) return 0;
  return registration.oneTimeFee + registration.monthlyCampaignFee;
}

/**
 * Get all services by category
 */
export function getServicesByCategory(category: string): (UsageService | AddOnService)[] {
  const allUsageServices = [
    ...MESSAGING_RATES,
    ...CALL_RATES,
    ...EMAIL_SERVICES,
    ...AI_SERVICES,
  ];
  const allAddOns = [
    ...PHONE_NUMBERS,
    ...EMAIL_ADDONS,
    AI_EMPLOYEE_SUBSCRIPTION,
    ...WORDPRESS_HOSTING,
    WHATSAPP_SERVICE,
    ...ONLINE_LISTINGS,
    HIPAA_COMPLIANCE,
    BRANDED_MOBILE_APP,
  ];

  return [
    ...allUsageServices.filter(s => s.category === category),
    ...allAddOns.filter(s => s.category === category),
  ];
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  CORE_PLANS,
  PHONE_NUMBERS,
  MESSAGING_RATES,
  CALL_RATES,
  A2P_REGISTRATION,
  CARRIER_FEES,
  EMAIL_SERVICES,
  EMAIL_ADDONS,
  AI_SERVICES,
  AI_EMPLOYEE_SUBSCRIPTION,
  WORDPRESS_HOSTING,
  WHATSAPP_SERVICE,
  ONLINE_LISTINGS,
  HIPAA_COMPLIANCE,
  BRANDED_MOBILE_APP,
  WORKFLOW_TIERS,
  SAAS_CLIENT_TIERS,
};
