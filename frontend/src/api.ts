export type Sentiment = "positive" | "neutral" | "negative";

export interface Highlight {
  sentence: string;
  emoji: string;
}

export interface AnalyzeRequest {
  text: string;
  use_own_key: boolean;
  groq_api_key?: string;
}

export interface AnalyzeResponse {
  summary_lines: string[];
  sentiment: Sentiment;
  highlights: Highlight[];
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function analyze(
  payload: AnalyzeRequest
): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const message =
      (data && (data.detail ?? data.message)) ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return (await response.json()) as AnalyzeResponse;
}

