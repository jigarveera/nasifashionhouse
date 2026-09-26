import { useState } from 'react';
import { X } from 'lucide-react';
import { storefrontApi } from '../../features/catalog/api';

function EnvelopeArt() {
  return <svg className="newsletter-envelope" viewBox="0 0 460 380" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="newsletter-back" x1="102" y1="82" x2="359" y2="277" gradientUnits="userSpaceOnUse"><stop stopColor="#f6dbff" stopOpacity=".85" /><stop offset=".5" stopColor="#bd62d6" stopOpacity=".62" /><stop offset="1" stopColor="#4a2057" stopOpacity=".8" /></linearGradient>
      <linearGradient id="newsletter-paper" x1="142" y1="100" x2="312" y2="266" gradientUnits="userSpaceOnUse"><stop stopColor="#fff9ff" /><stop offset=".62" stopColor="#edcdf5" /><stop offset="1" stopColor="#bd8dce" /></linearGradient>
      <linearGradient id="newsletter-glass" x1="96" y1="154" x2="354" y2="315" gradientUnits="userSpaceOnUse"><stop stopColor="#f9ddff" stopOpacity=".88" /><stop offset=".47" stopColor="#d18ee8" stopOpacity=".7" /><stop offset="1" stopColor="#7f2e97" stopOpacity=".89" /></linearGradient>
      <linearGradient id="newsletter-fold" x1="82" y1="198" x2="376" y2="306" gradientUnits="userSpaceOnUse"><stop stopColor="#fff5ff" stopOpacity=".83" /><stop offset=".55" stopColor="#ce7be5" stopOpacity=".55" /><stop offset="1" stopColor="#6f257f" stopOpacity=".9" /></linearGradient>
      <linearGradient id="newsletter-type" x1="173" y1="138" x2="290" y2="190" gradientUnits="userSpaceOnUse"><stop stopColor="#7f2e97" /><stop offset="1" stopColor="#bb58d8" /></linearGradient>
      <filter id="newsletter-shadow" x="44" y="44" width="374" height="315" filterUnits="userSpaceOnUse"><feGaussianBlur stdDeviation="18" /></filter>
    </defs>
    <ellipse cx="232" cy="312" rx="155" ry="23" fill="#08020c" opacity=".7" filter="url(#newsletter-shadow)" />
    <path d="M85 171 210 81c12-9 27-9 39 0l126 90-145 100L85 171Z" fill="url(#newsletter-back)" stroke="#fff7ff" strokeOpacity=".6" strokeWidth="3" />
    <g transform="rotate(-5 230 177)">
      <rect x="146" y="101" width="168" height="164" rx="18" fill="url(#newsletter-paper)" stroke="#fff" strokeOpacity=".85" strokeWidth="3" />
      <path d="M167 193h125M167 211h96M167 229h116" stroke="#7f2e97" strokeOpacity=".32" strokeWidth="5" strokeLinecap="round" />
      <text x="230" y="172" fill="url(#newsletter-type)" textAnchor="middle" fontFamily="Barlow, Arial, sans-serif" fontSize="37" fontWeight="700" letterSpacing="4">NFH</text>
    </g>
    <rect x="85" y="169" width="290" height="142" rx="24" fill="url(#newsletter-glass)" stroke="#fff4ff" strokeOpacity=".76" strokeWidth="3" />
    <path d="m88 184 142 93-142 25V184ZM372 184l-142 93 142 25V184Z" fill="url(#newsletter-fold)" stroke="#fff4ff" strokeOpacity=".5" strokeWidth="2" />
    <path d="m93 305 137-95 137 95H93Z" fill="url(#newsletter-fold)" stroke="#fff" strokeOpacity=".5" strokeWidth="2" />
    <path d="m90 175 140 97 140-97" stroke="#fff" strokeOpacity=".78" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M105 294h249" stroke="#fff" strokeOpacity=".54" strokeWidth="3" strokeLinecap="round" />
    <path d="M82 111h7m-3.5-3.5v7M381 105h9m-4.5-4.5v9M372 337h7m-3.5-3.5v7" stroke="#f3c4ff" strokeWidth="2" strokeLinecap="round" />
  </svg>;
}

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [pending, setPending] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const address = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setStatus({ type: 'error', message: 'Enter a valid email address.' });
      return;
    }
    setPending(true);
    setStatus({ type: 'idle', message: '' });
    try {
      await storefrontApi.subscribe(address);
      setStatus({ type: 'success', message: 'You are subscribed.' });
      setEmail('');
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Newsletter signup is unavailable right now.' });
    } finally {
      setPending(false);
    }
  }

  if (dismissed) return null;

  return <section className="newsletter-section" aria-labelledby="newsletter-title">
    <div className="newsletter-card">
      <button className="newsletter-close" type="button" onClick={() => setDismissed(true)} aria-label="Dismiss newsletter"><X size={23} strokeWidth={2} aria-hidden="true" /></button>
      <div className="newsletter-visual"><EnvelopeArt /></div>
      <div className="newsletter-content">
        <p className="newsletter-eyebrow">THE NFH EDIT</p>
        <h2 id="newsletter-title">A little style, <span>straight to your inbox.</span></h2>
        <p className="newsletter-description">Be first to hear about new collections and style notes when our newsletter launches.</p>
        <form className="newsletter-form" onSubmit={submit} noValidate>
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <div className="newsletter-field">
            <input id="newsletter-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="example@domain.com" value={email} onChange={(event) => { setEmail(event.target.value); if (status.type === 'error') setStatus({ type: 'idle', message: '' }); }} aria-describedby="newsletter-status" />
            <button type="submit" disabled={pending}>{pending ? 'Joining…' : 'Subscribe'}</button>
          </div>
          <p id="newsletter-status" className={`newsletter-status ${status.type}`} role={status.type === 'error' ? 'alert' : 'status'}>{status.message || 'Signups are not live yet. Your email is not saved.'}</p>
        </form>
      </div>
    </div>
  </section>;
}
