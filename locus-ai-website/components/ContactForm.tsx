'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ContactForm() {
  const params = useSearchParams();
  const topic = params.get('topic') === 'integration' ? 'integration' : 'demo';
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending'); setErrors({});
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, topic }) });
      const j = await r.json();
      if (j.ok) setState('done'); else { setErrors(j.errors || {}); setState('error'); }
    } catch { setState('error'); setErrors({ form: 'Something went wrong. Try again in a moment.' }); }
  }
  if (state === 'done') return (
    <div className="card card-lg stack gap-12 panel-in" role="status">
      <span className="status status-ok" style={{ alignSelf: 'flex-start' }}>Request received</span>
      <h2 className="h3">Thanks. We’ll reply within one business day.</h2>
      <p className="small">In the meantime you can click through the product in the live demo.</p>
      <a className="btn btn-primary" href="/demo">Open the live demo</a>
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
      <h2 className="h3">{topic === 'integration' ? 'Request an integration' : 'Book a demo'}</h2>
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
        <label htmlFor="message">{topic === 'integration' ? 'Which tool, and what do you decide there?' : 'What should we cover? (optional)'}</label>
        <textarea id="message" name="message" className="input" />
      </div>
      {errors.form && <p className="help err" role="alert">{errors.form}</p>}
      <button className="btn btn-primary btn-lg btn-block" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : topic === 'integration' ? 'Send request' : 'Book a demo'}</button>
      <p className="caption">By submitting you agree to our <a href="/privacy">Privacy Policy</a>.</p>
    </form>
  );
}
