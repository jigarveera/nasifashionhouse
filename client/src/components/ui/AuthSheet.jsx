import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Apple, ArrowLeft, ArrowRight, Check, LockKeyhole, LogOut, Mail, PackageOpen, UserRound, X } from 'lucide-react';
import gownModel from '../../assets/model/model-gown.png';
import sareeModel from '../../assets/model/model-saree.png';

const emptyCode = () => Array(6).fill('');
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function AuthSheet({ onClose, onVerified, onSignOut, previewProfile, orders = [] }) {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState('signin');
  const [step, setStep] = useState('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState(emptyCode);
  const [demoCode, setDemoCode] = useState('');
  const [error, setError] = useState('');
  const [providerMessage, setProviderMessage] = useState('');
  const [profileTab, setProfileTab] = useState('profile');
  const dialogRef = useRef(null);
  const contentRef = useRef(null);
  const closeRef = useRef(null);
  const codeRefs = useRef([]);
  const successTimerRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), input:not([disabled])')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(successTimerRef.current);
      previousFocus?.focus?.();
    };
  }, [onClose]);

  useEffect(() => {
    if (step !== 'otp') return undefined;
    const timer = window.setTimeout(() => codeRefs.current[0]?.focus(), reducedMotion ? 0 : 250);
    return () => window.clearTimeout(timer);
  }, [step, reducedMotion]);

  function switchMode(nextMode) {
    setMode(nextMode);
    setStep('details');
    setDigits(emptyCode());
    setDemoCode('');
    setError('');
    setProviderMessage('');
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function sendCode(event) {
    event.preventDefault();
    if (mode === 'signup' && name.trim().length < 2) { setError('Enter your name to continue.'); return; }
    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) { setError('Enter a valid email address.'); return; }

    const randomValue = new Uint32Array(1);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(randomValue);
    else randomValue[0] = Math.floor(Math.random() * 900000);
    setDemoCode(String(100000 + randomValue[0] % 900000));
    setEmail(trimmedEmail);
    setDigits(emptyCode());
    setError('');
    setProviderMessage('');
    setStep('otp');
  }

  function updateDigit(index, value) {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) {
      setDigits((current) => current.map((digit, position) => position === index ? '' : digit));
      return;
    }
    const next = [...digits];
    numbers.slice(0, 6 - index).split('').forEach((digit, offset) => { next[index + offset] = digit; });
    setDigits(next);
    setError('');
    codeRefs.current[Math.min(index + numbers.length, 5)]?.focus();
  }

  function handleCodeKeyDown(index, event) {
    if (event.key === 'Backspace' && !digits[index] && index > 0) codeRefs.current[index - 1]?.focus();
    if (event.key === 'ArrowLeft' && index > 0) codeRefs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < 5) codeRefs.current[index + 1]?.focus();
  }

  function pasteCode(event) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    setDigits(Array.from({ length: 6 }, (_, index) => pasted[index] || ''));
    setError('');
    codeRefs.current[Math.min(pasted.length, 5)]?.focus();
  }

  function verifyCode(event) {
    event.preventDefault();
    if (digits.join('').length !== 6) { setError('Enter all six digits.'); return; }
    if (digits.join('') !== demoCode) { setError('That code does not match the demo code. Try again.'); return; }
    setError('');
    onVerified({ name: name.trim(), email });
    setStep('success');
    successTimerRef.current = window.setTimeout(onClose, 1600);
  }

  const isSignup = mode === 'signup';
  const isProfile = !!previewProfile && step !== 'success';
  const title = isProfile ? 'Your profile' : step === 'otp' ? 'Verify your email' : isSignup ? 'Create your account' : 'Sign in';

  return (
    <motion.div className="auth-overlay fixed inset-0 z-[150] flex items-end justify-center bg-black/75" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div ref={dialogRef} className="auth-sheet w-full max-w-[480px] text-white" role="dialog" aria-modal="true" aria-labelledby="auth-sheet-title" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: reducedMotion ? 0 : .38, ease: [0.22, 1, 0.36, 1] }}>
        <div ref={contentRef} className="auth-sheet-body">
          <div className="auth-sheet-header">
            <div><p className="auth-eyebrow">NASI FASHION HOUSE / ACCOUNT</p><h2 id="auth-sheet-title">{step === 'success' ? 'All set.' : title}</h2></div>
            <button ref={closeRef} className="auth-close" type="button" onClick={onClose} aria-label="Close account sheet"><X size={19} aria-hidden="true" /></button>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {step === 'success' ? (
              <motion.div key="success" className="auth-success" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .24 }} role="status">
                <span className="auth-success-icon"><Check size={29} aria-hidden="true" /></span>
                <h3>Email confirmed</h3>
                <p>Your profile preview is ready for this visit. No account session was created.</p>
              </motion.div>
            ) : isProfile ? (
              <motion.div key="profile" className="auth-profile" initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
                <div className="auth-profile-tabs" role="tablist" aria-label="Account sections"><button type="button" role="tab" aria-selected={profileTab === 'profile'} onClick={() => setProfileTab('profile')}>Profile</button><button type="button" role="tab" aria-selected={profileTab === 'orders'} onClick={() => setProfileTab('orders')}>Orders</button></div>
                {profileTab === 'profile' ? <div role="tabpanel">
                  <div className="auth-profile-identity"><div className="auth-profile-avatar"><UserRound size={25} strokeWidth={1.7} aria-hidden="true" /></div><div><span>PROFILE PREVIEW</span><h3>{previewProfile.name || 'Your account'}</h3></div></div>
                  <div className="auth-profile-detail"><span>EMAIL ADDRESS</span><strong>{previewProfile.email}</strong></div>
                  <p className="auth-profile-note">This is a local preview for this visit. A real account session has not been created.</p>
                  <button className="auth-signout" type="button" onClick={onSignOut}><LogOut size={17} strokeWidth={1.7} aria-hidden="true" /> Sign out</button>
                </div> : <div className="auth-orders" role="tabpanel">{orders.length ? orders.map((order) => <article className="auth-order" key={order.id}><strong>Order {order.number || order.id}</strong><span>{order.status}</span><small>{order.total}</small></article>) : <><PackageOpen size={30} strokeWidth={1.4} aria-hidden="true" /><h3>No orders yet</h3><p>Verified orders will be listed here when checkout is connected.</p></>}</div>}
              </motion.div>
            ) : (
              <motion.div key={mode} initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -9 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
                <p className="auth-intro">{isSignup ? 'Create a profile for the pieces you love.' : 'Continue with your email address.'}</p>
                <p className="auth-preview-note">Preview mode · Your code appears here. No email is sent.</p>
                <form noValidate onSubmit={step === 'details' ? sendCode : verifyCode}>
                  {isSignup && <label className="auth-label" htmlFor="auth-name">Name</label>}
                  {isSignup && <div className={`auth-field ${step === 'otp' ? 'is-locked' : ''}`}><UserRound size={18} strokeWidth={1.7} aria-hidden="true" /><input id="auth-name" name="name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} readOnly={step === 'otp'} placeholder="Your name" /></div>}

                  <label className="auth-label" htmlFor="auth-email">Email address</label>
                  <div className={`auth-field ${step === 'otp' ? 'is-locked' : ''}`}><Mail size={18} strokeWidth={1.7} aria-hidden="true" /><input id="auth-email" name="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={(event) => setEmail(event.target.value)} readOnly={step === 'otp'} placeholder="you@example.com" />{step === 'otp' && <LockKeyhole size={16} aria-hidden="true" />}</div>

                  {step === 'otp' && <motion.div className="auth-otp-stage" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .25 }}>
                    <div className="auth-otp-heading"><span>Enter your 6-digit code</span><button type="button" onClick={() => { setStep('details'); setError(''); }}><ArrowLeft size={13} aria-hidden="true" /> Edit email</button></div>
                    <div className="auth-otp-inputs" role="group" aria-label="Six-digit verification code" onPaste={pasteCode}>
                      {digits.map((digit, index) => <motion.input key={index} ref={(element) => { codeRefs.current[index] = element; }} className="auth-otp-digit" type="text" inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} maxLength={6} value={digit} onChange={(event) => updateDigit(index, event.target.value)} onKeyDown={(event) => handleCodeKeyDown(index, event)} aria-label={`Digit ${index + 1}`} initial={{ opacity: 0, y: 10, scale: .9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: reducedMotion ? 0 : index * .045, duration: reducedMotion ? 0 : .23 }} />)}
                    </div>
                    <p className="auth-demo-code">Preview only · No email was sent. Your demo code is <strong>{demoCode}</strong>.</p>
                  </motion.div>}

                  {error && <p className="auth-error" role="alert">{error}</p>}
                  <button className="auth-primary" type="submit">{step === 'details' ? 'Send OTP' : 'Verify code'} <ArrowRight size={17} strokeWidth={1.8} aria-hidden="true" /></button>
                </form>

                {step === 'details' && <>
                  <div className="auth-divider"><span>or continue with</span></div>
                  <div className="auth-providers">
                    <button type="button" onClick={() => setProviderMessage('Google sign-in is not connected in this preview.')}><span className="auth-google-mark" aria-hidden="true">G</span>{isSignup ? 'Sign up with Google' : 'Sign in with Google'}</button>
                    <button type="button" onClick={() => setProviderMessage('Apple sign-in is not connected in this preview.')}><Apple size={20} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />{isSignup ? 'Sign up with Apple' : 'Sign in with Apple'}</button>
                  </div>
                  {providerMessage && <p className="auth-provider-message" role="status">{providerMessage}</p>}
                  <p className="auth-switch">{isSignup ? 'Already have an account?' : "Don't have an account?"} <button type="button" onClick={() => switchMode(isSignup ? 'signin' : 'signup')}>{isSignup ? 'Sign in' : 'Sign up'}</button></p>
                </>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className={`auth-art ${isSignup ? 'is-signup' : ''}`} aria-hidden="true">
          <img src={isSignup ? sareeModel : gownModel} alt="" />
        </div>
      </motion.div>
    </motion.div>
  );
}
