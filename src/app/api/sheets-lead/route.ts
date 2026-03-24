import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type LeadPayload = {
  name?: string;
  company?: string;
  contact?: string; // teléfono o correo
  message?: string;
  source?: string;
};

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadPayload;

    const webhookUrl = requiredEnv('GOOGLE_SHEETS_WEBHOOK_URL');
    const token = process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN; // optional

    const payload = {
      ...body,
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'X-Webhook-Token': token } : {}),
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Sheets webhook failed (${res.status}): ${text}`);

    return NextResponse.json({ ok: true, raw: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
