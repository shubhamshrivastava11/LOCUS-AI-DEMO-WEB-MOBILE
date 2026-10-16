import { NextResponse } from 'next/server';

const PERSONAL = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'proton.me', 'protonmail.com'];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 }); }
  const name = String(body.name ?? '').trim().slice(0, 120);
  const email = String(body.email ?? '').trim().toLowerCase().slice(0, 200);
  const company = String(body.company ?? '').trim().slice(0, 160);
  const size = String(body.size ?? '').slice(0, 40);
  const topic = String(body.topic ?? 'demo').slice(0, 40);
  const message = String(body.message ?? '').trim().slice(0, 2000);
  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = 'Enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Enter a valid work email.';
  else if (PERSONAL.includes(email.split('@')[1])) errors.email = 'Use your work email so we can match you to your company.';
  if (company.length < 2) errors.company = 'Enter your company name.';
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  // Lead delivery: set LEADS_WEBHOOK_URL in Vercel (Slack/HubSpot/Zapier webhook) to receive submissions.
  const hook = process.env.LEADS_WEBHOOK_URL;
  if (hook) {
    try {
      await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: `New Locus AI ${topic} request: ${name} <${email}>, ${company} (${size}). ${message}`, name, email, company, size, topic, message }) });
    } catch { /* do not fail the visitor if the webhook is down */ }
  } else {
    console.log('[lead]', { name, email, company, size, topic, message });
  }
  return NextResponse.json({ ok: true });
}
