export interface EstimateItem {
  id: number;
  estimate_id: number;
  item_name: string;
  quantity_text: string;
  warehouse_name: string;
  storage_type: string;
  remark: string | null;
  created_at: string;
}

export interface EstimateItemFormData {
  item_name: string;
  quantity_text: string;
  warehouse_name: string;
  storage_type: string;
  remark: string;
}
