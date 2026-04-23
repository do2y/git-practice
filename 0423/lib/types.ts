export interface InventoryItem {
  id: number;
  productInitial: string;
  productName: string;
  category: string;
  status: string;
  location: string;
  storagePeriod: string;
  inboundDate: string;
  outboundDueDate: string;
  expectedAmount: string;
  contractDetail?: string;
}

export interface SummaryCardData {
  title: string;
  value: string;
  subText?: string;
  icon?: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  message: string;
}

export interface InboundFormData {
  productInitial: string;
  productName: string;
  category: string;
  status: string;
  location: string;
  storagePeriod: string;
  inboundDate: string;
  outboundDueDate: string;
  expectedAmount: string;
}

export interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export interface MenuItem {
  label: string;
  icon: string;
  type: 'main' | 'sub';
}

export interface AuthUser {
  userId: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthTokenPayload extends AuthUser {}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
}
