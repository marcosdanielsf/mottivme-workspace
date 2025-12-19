export interface Company {
  id: string;
  name: string;
  email: string;
  plan: "starter" | "pro" | "enterprise";
  brand_primary: string;
  brand_secondary: string;
  logo_url: string | null;
  stripe_customer_id: string | null;
  owner_phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  company_id: string;
  title: string;
  client_name: string;
  client_email: string | null;
  client_company: string | null;
  content: ProposalContent;
  template: string;
  expiry_date: string | null;
  status: "draft" | "active" | "expired" | "won" | "lost";
  value: number | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProposalContent {
  hero: {
    headline: string;
    subheadline: string;
  };
  problems: string[];
  solutions: {
    title: string;
    description: string;
  }[];
  benefits: string[];
  pricing: {
    title: string;
    value: number;
    features: string[];
    highlighted?: boolean;
  }[];
  testimonials?: {
    name: string;
    role: string;
    text: string;
    avatar?: string;
  }[];
  cta: {
    text: string;
    url: string;
  };
  faq?: {
    question: string;
    answer: string;
  }[];
}

export interface Lead {
  id: string;
  proposal_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  score: number;
  status: "pending" | "viewed" | "engaged" | "hot" | "won" | "lost";
  last_activity: string | null;
  total_time_seconds: number;
  visit_count: number;
  created_at: string;
}

export interface TrackingEvent {
  id: string;
  lead_id: string;
  proposal_id: string;
  event_type: TrackingEventType;
  event_data: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export type TrackingEventType =
  | "page_view"
  | "section_enter"
  | "section_exit"
  | "cta_click"
  | "chat_open"
  | "chat_message"
  | "video_play"
  | "video_complete"
  | "scroll_depth"
  | "time_on_page";

export interface ChatMessage {
  id: string;
  lead_id: string;
  sender: "user" | "bot" | "human";
  message: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Alert {
  id: string;
  company_id: string;
  lead_id: string;
  type: "lead_online" | "high_score" | "chat_started" | "revisit" | "cta_click";
  title: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
}
