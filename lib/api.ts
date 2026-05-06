import { ApiResponse } from './types';

const WEBHOOK_URL = "https://omdeveloper.app.n8n.cloud/webhook/study";
export async function askEduMate(params: {
  phone: string;
  name: string;
  question: string;
}): Promise<ApiResponse> {
  const res = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error(`Webhook failed with status ${res.status}`);
  }

  // The n8n webhook is expected to return JSON. Fall back to text if not.
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = (await res.json()) as ApiResponse | ApiResponse[];
    // n8n sometimes wraps responses in an array
    if (Array.isArray(data)) return data[0] ?? { answer: '' };
    return data;
  }

  const text = await res.text();
  // Try to parse if it's still JSON-shaped
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed[0] ?? { answer: '' };
    return parsed as ApiResponse;
  } catch {
    return { answer: text };
  }
}
