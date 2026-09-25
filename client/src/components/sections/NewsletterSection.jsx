import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { storefrontApi } from '../../features/catalog/api';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setMessage('Enter a valid email address.'); return; }
    setPending(true);
    try { await storefrontApi.subscribe(email.trim()); setMessage('You are subscribed.'); setEmail(''); }
    catch (error) { setMessage(error.message); }
    finally { setPending(false); }
  }
  return <section className="newsletter" aria-labelledby="newsletter-title">
    <div><span className="eyebrow">THE NFH EDIT</span><h2 id="newsletter-title">A little inspiration, <em>delivered.</em></h2><p>Style ideas and collection notes, when our newsletter launches.</p></div>
    <form onSubmit={submit}><label htmlFor="newsletter-email">Email address</label><div className="newsletter-field"><input id="newsletter-email" type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} /><button type="submit" disabled={pending} aria-label="Join newsletter"><ArrowRight size={21} /></button></div><small aria-live="polite">{message || 'Signup is not connected yet; no email is saved.'}</small></form>
  </section>;
}
