import type {
  AuthResponse,
  InboundFormData,
  InquiryFormData,
  InventoryItem,
  LoginFormData,
  SignupFormData,
  SummaryCardData,
} from './types';

async function getErrorMessage(res: Response, fallbackMessage: string) {
  try {
    const data = await res.json();
    return data.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export async function fetchInventoryRows(): Promise<InventoryItem[]> {
  const res = await fetch('/api/inventory');

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Failed to load inventory.'));
  }

  return res.json();
}

export async function fetchInventoryItem(id: number): Promise<InventoryItem> {
  const res = await fetch(`/api/inventory/${id}`);

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Failed to load item details.'));
  }

  return res.json();
}

export async function createInventoryItem(
  itemData: InboundFormData
): Promise<{ success: boolean }> {
  const res = await fetch('/api/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Failed to create inventory item.'));
  }

  return res.json();
}

export async function fetchSummaryCards(
  menu: string
): Promise<{ main: SummaryCardData[] }> {
  const res = await fetch(`/api/summary?menu=${encodeURIComponent(menu)}`);

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Failed to load summary cards.'));
  }

  return res.json();
}

export async function submitInquiry(
  formData: InquiryFormData
): Promise<{ success: boolean }> {
  const res = await fetch('/api/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Failed to submit inquiry.'));
  }

  return res.json();
}

export async function signupUser(formData: SignupFormData): Promise<AuthResponse> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Account creation failed.'));
  }

  return res.json();
}

export async function loginUser(formData: LoginFormData): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Sign-in failed.'));
  }

  return res.json();
}

export async function logoutUser(): Promise<{ success: boolean }> {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, 'Sign-out failed.'));
  }

  return res.json();
}
