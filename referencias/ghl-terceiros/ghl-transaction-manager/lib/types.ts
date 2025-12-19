export interface Transaction {
  id: string;
  ghl_opportunity_id: string;
  ghl_location_id: string;
  ghl_user_id: string;
  ghl_contact_id?: string;
  property_address?: string;
  deal_value?: number;
  contract_date?: string;
  closing_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GHLContext {
  locationId: string;
  userId: string;
  companyId?: string;
}