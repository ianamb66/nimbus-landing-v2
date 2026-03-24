import { NextResponse } from 'next/server';
import { Resend } from 'resend';

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

function safe(v?: string) {
  return (v || '').toString().trim();
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LeadPayload;

    const toEmail = requiredEnv('LEADS_TO_EMAIL');
    const resendApiKey = requiredEnv('RESEND_API_KEY');

    // Para empezar sin verificar dominio en Resend puedes usar onboarding@resend.dev
    const fromEmail = process.env.LEADS_FROM_EMAIL || 'onboarding@resend.dev';

    const payload = {
      timestamp: new Date().toISOString(),
      name: safe(body.name),
      company: safe(body.company),
      contact: safe(body.contact),
      message: safe(body.message),
      source: safe(body.source) || 'web',
    };

    if (!payload.name) throw new Error('Falta el nombre');
    if (!payload.contact) throw new Error('Falta el contacto');
    if (!payload.message) throw new Error('Falta el mensaje');

    const resend = new Resend(resendApiKey);

    const subject = `Nuevo lead (Nimbus) — ${payload.name}${payload.company ? ` / ${payload.company}` : ''}`;

    const text = [
      'Nuevo lead desde la web (Nimbus)',
      '',
      `Fecha: ${payload.timestamp}`,
      `Nombre: ${payload.name}`,
      `Empresa: ${payload.company || '-'}`,
      `Contacto: ${payload.contact}`,
      `Origen: ${payload.source}`,
      '',
      'Mensaje:',
      payload.message,
      '',
      '---',
      'Este correo fue enviado automáticamente desde el formulario de contacto.',
    ].join('\n');

    const { error } = await resend.emails.send({
      from: `Nimbus Leads <${fromEmail}>`,
      to: [toEmail],
      subject,
      text,
      replyTo: payload.contact.includes('@') ? payload.contact : undefined,
    });

    if (error) throw new Error(error.message || 'No se pudo enviar el correo');

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
