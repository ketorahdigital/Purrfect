/**
 * Client wrapper for calling the Vercel Edge Function at /api/guru
 *
 * This is the same wrapper provided earlier but included here so you can add it to the repo.
 * It supports timeout and optional client-key header. It also accepts an AbortSignal via options.signal.
 *
 * Usage:
 *  import { sendGuruMessage } from '../services/guruClient';
 *  const reply = await sendGuruMessage('How do I market catnip?');
 */

export type GuruResponse = {
  reply?: string;
  error?: string;
  detail?: string;
};

const DEFAULT_TIMEOUT_MS = 30_000;

function getClientKeyHeader(): string | null {
  return typeof process !== 'undefined' ? (process.env.NEXT_PUBLIC_GURU_CLIENT_KEY ?? null) : null;
}

export async function sendGuruMessage(
  message: string,
  options?: { timeoutMs?: number; clientKey?: string; signal?: AbortSignal }
): Promise<string> {
  if (!message || !message.trim()) throw new Error('Message is empty');

  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  let controller: AbortController | null = null;
  let timeoutHandle: number | undefined;

  if (options?.signal) {
    // If caller passed a signal, we won't create our own timeout controller; instead we combine if needed.
    controller = null;
  } else {
    controller = new AbortController();
    timeoutHandle = window.setTimeout(() => controller?.abort(), timeoutMs);
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const clientKey = options?.clientKey ?? getClientKeyHeader();
    if (clientKey) {
      headers['x-guru-client-key'] = clientKey;
    }

    const res = await fetch('/api/guru', {
      method: 'POST',
      headers,
      body: JSON.stringify({ message }),
      signal: options?.signal ?? controller?.signal,
    });

    if (timeoutHandle) window.clearTimeout(timeoutHandle);

    const contentType = res.headers.get('content-type') ?? '';
    let body: GuruResponse | null = null;
    if (contentType.includes('application/json')) {
      body = await res.json().catch(() => null);
    } else {
      const text = await res.text().catch(() => '');
      if (res.ok) return text;
      throw new Error(`Unexpected response: ${res.status} ${text}`);
    }

    if (!res.ok) {
      const serverMsg = body?.error ?? body?.detail ?? `Status ${res.status}`;
      throw new Error(serverMsg);
    }

    const reply = body?.reply ?? '';
    if (!reply) {
      throw new Error(body?.error ?? 'Empty reply from server');
    }

    return reply;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw err;
  } finally {
    if (timeoutHandle) window.clearTimeout(timeoutHandle);
  }
}
