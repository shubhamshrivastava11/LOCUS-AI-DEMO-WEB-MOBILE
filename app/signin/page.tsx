'use client';
import { asset } from '@/lib/base';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'start' | 'sso' | 'err'>('start');
  const [msg, setMsg] = useState('');
  function sso(e: React.FormEvent) {
    e.preventDefault();
    const d = email.split('@')[1]?.toLowerCase();
    if (!d || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setStep('err'); setMsg('Enter a valid work email.'); return; }
    if (['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'].includes(d)) { setStep('err'); setMsg('Personal email domains are blocked. Use your work email.'); return; }
    setStep('sso'); setMsg(d);
    setTimeout(() => router.push('/demo'), 1800);
  }
  return (
    <main id="main" style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      <div className="container row between" style={{ height: 72 }}>
        <Link href="/" aria-label="Locus AI home"><img src={asset('/logo-light.svg')} alt="Locus AI" width={150} height={31} /></Link>
        <Link href="/contact" className="small">Need help? Contact support</Link>
      </div>
      <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: '24px 20px 64px' }}>
        <div className="card card-lg stack gap-16 panel-in" style={{ width: 'min(460px, 100%)', boxShadow: 'var(--shadow-md)' }}>
          {step === 'sso' ? (
            <div className="stack gap-16" role="status">
              <img src={asset('/mark.svg')} alt="" width={40} height={40} />
              <h1 className="h2">Redirecting to your identity provider</h1>
              <p className="body">{msg} uses SAML single sign-on. You’ll come back here after signing in.</p>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-subtle)', overflow: 'hidden' }}><div style={{ height: 6, width: '60%', background: 'var(--brand)', borderRadius: 3, animation: 'rise 1.8s ease' }} /></div>
              <p className="caption">Demo environment: you’ll land in the interactive product demo.</p>
            </div>
          ) : (
            <>
              <h1 className="h2">Sign in to Locus AI</h1>
              <p className="body">Use your work account. Personal email domains are blocked by default.</p>
              <button className="btn btn-secondary btn-lg btn-block" onClick={() => router.push('/demo')}>Continue with Google</button>
              <button className="btn btn-secondary btn-lg btn-block" onClick={() => router.push('/demo')}>Continue with Microsoft</button>
              <div className="row gap-12"><hr className="divider" style={{ flex: 1 }} /><span className="caption">or</span><hr className="divider" style={{ flex: 1 }} /></div>
              <form onSubmit={sso} className="stack gap-12" noValidate>
                <div className="field">
                  <label htmlFor="email">Work email</label>
                  <input id="email" className="input" type="email" autoComplete="email" placeholder="name@company.com" value={email} onChange={(e) => { setEmail(e.target.value); setStep('start'); }} aria-invalid={step === 'err'} aria-describedby="email-h" />
                  <span id="email-h" className={`help ${step === 'err' ? 'err' : ''}`}>{step === 'err' ? msg : 'We’ll route you to your company’s SSO if it is set up.'}</span>
                </div>
                <button className="btn btn-primary btn-lg btn-block">Continue with SSO</button>
              </form>
              <p className="caption">By continuing you agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>. No account yet? <Link href="/contact">Request access</Link>.</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
