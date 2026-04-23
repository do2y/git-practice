import type { Estimate, EstimateFormData } from '@/types/estimate';
import type { EstimateItemFormData } from '@/types/estimate-item';

async function getErrorMessage(res: Response, fallback: string) {
  try {
    const data = await res.json();
    return data.message || fallback;
  } catch {
    return fallback;
  }
}

export async function saveEstimate(payload: {
  form: EstimateFormData;
  items: EstimateItemFormData[];
}): Promise<{ success: boolean; id: number }> {
  const res = await fetch('/api/estimates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, '견적 저장에 실패했습니다.'));
  }

  return res.json();
}

export async function fetchEstimateDetail(id: number): Promise<Estimate> {
  const res = await fetch(`/api/estimates/${id}`);

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, '견적 조회에 실패했습니다.'));
  }

  return res.json();
}

export async function updateEstimateStatus(
  id: number,
  status: string
): Promise<{ success: boolean }> {
  const res = await fetch(`/api/estimates/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(await getErrorMessage(res, '상태 변경에 실패했습니다.'));
  }

  return res.json();
}
