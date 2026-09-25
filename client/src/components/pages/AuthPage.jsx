import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup';
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (isSignup && !String(data.get('name') || '').trim()) { setError('Enter your name.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get('email') || ''))) { setError('Enter a valid email address.'); return; }
    if (String(data.get('password') || '').length < 8) { setError('Password must have at least 8 characters.'); return; }
    setError('Account service is not connected yet. No account was created.');
  }
  return <div className="auth-page container grid grid-cols-1 items-center gap-9 md:grid-cols-2"><div className="auth-image"><img src="/images/photo-1539109136881-3be0616acf4b.jpg" alt="Woman wearing an expressive contemporary outfit" /><span>Style, on your terms.</span></div><div className="auth-content"><span className="eyebrow">YOUR NFH SPACE</span><h1>{isSignup ? <>Create your <em>account.</em></> : <>Welcome <em>back.</em></>}</h1><p>{isSignup ? 'Save the pieces you love and make your next visit feel like yours.' : 'Your favorites and future orders, all in one place.'}</p><div className="service-notice">Account sign-in is coming soon. This form is a preview and does not send your information.</div><form onSubmit={submit} noValidate>{isSignup && <label>Full name<input name="name" autoComplete="name" placeholder="Your name" /></label>}<label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label><label>Password<div className="password-field"><input name="password" type={visible ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} placeholder="At least 8 characters" /><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></label>{error && <p className="field-error" role="alert">{error}</p>}<button className="button button-dark full" type="submit">{isSignup ? 'Create account' : 'Log in'} <ArrowRight size={18} /></button></form><p className="auth-switch">{isSignup ? 'Already have an account?' : 'New to NFH?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Log in' : 'Create an account'}</Link></p></div></div>;
}
