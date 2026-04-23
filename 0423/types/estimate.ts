import type { EstimateItem } from './estimate-item';

export interface Estimate {
  id: number;
  item_name: string;
  contact_number: string;
  product_name: string;
  product_quantity: string;
  region_name: string;
  item_type: string;
  pallet_count: string;
  caution_text: string | null;
  status: string;
  created_at: string;
  items?: EstimateItem[];
}

export interface EstimateFormData {
  item_name: string;
  contact_number: string;
  product_name: string;
  product_quantity: string;
  region_name: string;
  item_type: string;
  pallet_count: string;
  caution_text: string;
}
