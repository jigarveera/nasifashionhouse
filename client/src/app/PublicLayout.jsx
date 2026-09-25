import { useEffect, useRef } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { OverlayContext } from './OverlayContext';
import NavigationBar from '../components/ui/NavigationBar';
import Footer from '../components/sections/Footer';
import CartDrawer from '../components/sections/CartDrawer';
import ProfileDrawer from '../components/sections/ProfileDrawer';

export default function PublicLayout() {
  const [params, setParams] = useSearchParams();
  const panel = params.get('panel');
  const active = panel === 'cart' || panel === 'account' ? panel : null;
  const navigate = useNavigate();
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);
  const openedHereRef = useRef(false);

  function openPanel(name, trigger, tab = 'profile') {
    triggerRef.current = trigger || document.activeElement;
    openedHereRef.current = true;
    const next = new URLSearchParams(params);
    next.set('panel', name);
    if (name === 'account') next.set('tab', tab);
    else next.delete('tab');
    setParams(next);
  }
  function closePanel() {
    if (openedHereRef.current) { openedHereRef.current = false; navigate(-1); }
    else {
      const next = new URLSearchParams(params);
      next.delete('panel'); next.delete('tab');
      setParams(next, { replace: true });
    }
  }

  useEffect(() => {
    if (!active) { openedHereRef.current = false; return undefined; }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const initial = window.setTimeout(() => dialogRef.current?.querySelector('[data-dialog-close]')?.focus(), 0);
    function onKeyDown(event) {
      if (event.key === 'Escape') { event.preventDefault(); closePanel(); return; }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(initial);
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
      triggerRef.current?.focus?.();
    };
  // closePanel uses the latest URL state; adding it here would reset focus on each query change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const context = { openPanel, closePanel, active };
  return <OverlayContext.Provider value={context}>
    <NavigationBar />
    <main id="main-content" className="min-h-screen"><Outlet /></main>
    <Footer />
    {active && <div className="overlay-root">
      <button type="button" className="overlay-backdrop" aria-label="Close panel" onClick={closePanel} />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={active === 'cart' ? 'Shopping bag' : 'Account'} className={`overlay-dialog ${active === 'cart' ? 'overlay-dialog-cart' : 'overlay-dialog-account'}`}>
        {active === 'cart' ? <CartDrawer onClose={closePanel} /> : <ProfileDrawer onClose={closePanel} />}
      </div>
    </div>}
  </OverlayContext.Provider>;
}
