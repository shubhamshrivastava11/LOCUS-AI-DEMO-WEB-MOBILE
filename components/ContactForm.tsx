'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SITE } from '@/lib/content';

const PERSONAL = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'proton.me', 'protonmail.com'];

export default function ContactForm() {
  const params = useSearchParams();
  const t = params.get('topic'); const topic = t === 'integration' || t === 'partner' ? t : 'demo';
  const [state, setState] = useState<'idle' | 'done' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState('');
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const name = (d.name || '').trim(); const email = (d.email || '').trim().toLowerCase(); const company = (d.company || '').trim();
    const errs: Record<string, string> = {};
    if (name.length < 2) errs.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errs.email = 'Enter a valid work email.';
    else if (PERSONAL.includes(email.split('@')[1])) errs.email = 'Use your work email so we can match you to your company.';
    if (company.length < 2) errs.company = 'Enter your company name.';
    setErrors(errs);
    if (Object.keys(errs).length) { setState('error'); return; }
    setSummary(`Hi, I'm ${name} from ${company} (${d.size}). I'd like ${topic === 'integration' ? 'to request an integration' : topic === 'partner' ? 'to apply to the Locus AI design partner program' : 'a Locus AI demo'}. ${(d.message || '').trim()} Reach me at ${email}.`.replace(/\s+/g, ' ').trim());
    setState('done');
  }
  if (state === 'done') return (
    <div className="card card-lg stack gap-12 panel-in" role="status" style={{ color: 'var(--text)' }}>
      <span className="status status-ok" style={{ alignSelf: 'flex-start' }}>Almost there</span>
      <h2 className="h3">Send this to us on LinkedIn and we’ll reply within one business day.</h2>
      <p className="small" style={{ padding: 14, borderRadius: 10, background: 'var(--bg-page)', border: '1px solid var(--border)' }}>{summary}</p>
      <div className="row gap-12 wrap">
        <button type="button" className="btn btn-secondary" onClick={() => { navigator.clipboard?.writeText(summary).catch(() => {}); setCopied(true); }}>{copied ? 'Copied' : 'Copy message'}</button>
        <a className="btn btn-primary" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">Message us on LinkedIn</a>
      </div>
      <Link className="small" href="/demo" style={{ fontWeight: 600 }}>Or click through the live demo →</Link>
    </div>
  );
  const f = (name: string, label: string, props: any = {}, help?: string) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} className="input" aria-invalid={!!errors[name]} aria-describedby={`${name}-h`} {...props} />
      <span id={`${name}-h`} className={`help ${errors[name] ? 'err' : ''}`}>{errors[name] || help || ' '}</span>
    </div>
  );
  return (
    <form className="card card-lg stack gap-12" onSubmit={submit} noValidate style={{ boxShadow: 'var(--shadow-md)', color: 'var(--text)' }}>
      <h2 className="h3">{topic === 'integration' ? 'Request an integration' : topic === 'partner' ? 'Apply to be a design partner' : 'Book a demo'}</h2>
      {f('name', 'Full name', { autoComplete: 'name', required: true })}
      {f('email', 'Work email', { type: 'email', autoComplete: 'email', required: true, placeholder: 'name@company.com' }, 'We’ll reply within one business day.')}
      {f('company', 'Company', { autoComplete: 'organization', required: true })}
      <div className="field">
        <label htmlFor="size">Company size</label>
        <select id="size" name="size" className="select" defaultValue="51–200">
          {['1–50', '51–200', '201–1,000', '1,001–5,000', '5,000+'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">{topic === 'integration' ? 'Which tool, and what do you decide there?' : topic === 'partner' ? 'Which team would pilot it, and which tools do they decide in?' : 'What should we cover? (optional)'}</label>
        <textarea id="message" name="message" className="input" />
      </div>
      {errors.form && <p className="help err" role="alert">{errors.form}</p>}
      <button className="btn btn-primary btn-lg btn-block" disabled={false}>{topic === 'integration' ? 'Send request' : topic === 'partner' ? 'Send application' : 'Book a demo'}</button>
      <p className="caption">By submitting you agree to our <Link href="/privacy">Privacy Policy</Link>.</p>
    </form>
  );
}
