import { useEffect, useRef, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../../app/useStore';
import { useOverlay } from '../../app/useOverlay';

const links = [{ to: '/', label: 'Home' }, { to: '/shop', label: 'Shop' }, { to: '/sale', label: 'Sale' }, { to: '/blog', label: 'Blog' }];

export default function NavigationBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [nearTop, setNearTop] = useState(true);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const { count, likes } = useStore();
  const { openPanel } = useOverlay();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const closeMenu = () => setMenuOpen(false);
  useEffect(() => {
    const update = () => {
      const hero = document.getElementById('hero-section');
      setNearTop(hero ? hero.getBoundingClientRect().bottom > 100 : isHome);
    };
    const frame = window.requestAnimationFrame(update);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isHome]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => menuRef.current?.querySelector('[data-menu-close]')?.focus(), 0);
    function onKeyDown(event) {
      if (event.key === 'Escape') { setMenuOpen(false); return; }
      if (event.key !== 'Tab' || !menuRef.current) return;
      const focusable = [...menuRef.current.querySelectorAll('button, a[href]')];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => { window.clearTimeout(timer); document.body.style.overflow = previous; document.removeEventListener('keydown', onKeyDown); menuButton?.focus(); };
  }, [menuOpen]);
  return <>
    <header className={`site-header ${isHome ? 'site-header-home' : ''} ${isHome && nearTop ? 'site-header-on-hero' : ''}`}>
      <nav className="navbar container" aria-label="Main navigation">
        <button ref={menuButtonRef} type="button" className="icon-button mobile-menu-button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={23} /></button>
        <Link className="brand-link" to="/" onClick={closeMenu} aria-label="Nasi Fashion House home"><img src="/brand/NFH-logo.svg" alt="Nasi Fashion House" /></Link>
        <div className="nav-links">{links.map((link) => <NavLink key={link.to} end={link.to === '/'} to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>{link.label}</NavLink>)}</div>
        <div className="nav-actions">
          <Link className="icon-button" to="/shop" aria-label="Search products"><Search size={20} /></Link>
          <button className="icon-button desktop-icon" type="button" onClick={(event) => openPanel('account', event.currentTarget, 'likemarks')} aria-label={`Open likemarks, ${likes.length} saved`}><Heart size={20} /></button>
          <button className="icon-button bag-button" type="button" aria-label={`Open shopping bag, ${count} items`} onClick={(event) => openPanel('cart', event.currentTarget)}><ShoppingBag size={20} />{count > 0 && <span className="bag-count">{count}</span>}</button>
          <Link className="icon-button mobile-account" to="/login" aria-label="Account login"><UserRound size={20} /></Link>
          <div className="guest-actions"><Link to="/login">Log in</Link><Link className="button button-dark button-small" to="/signup">Sign up <span aria-hidden="true">↗</span></Link></div>
        </div>
      </nav>
    </header>
    {menuOpen && <div ref={menuRef} className="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="mobile-menu-head"><img src="/brand/NFH-logo.svg" alt="Nasi Fashion House" /><button data-menu-close className="icon-button" type="button" onClick={closeMenu} aria-label="Close menu"><X size={24} /></button></div>
      <nav aria-label="Mobile navigation">{links.map((link) => <NavLink key={link.to} end={link.to === '/'} to={link.to} onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>{link.label}<span aria-hidden="true">↗</span></NavLink>)}</nav>
      <div className="mobile-menu-bottom flex flex-wrap gap-5"><Link to="/login" onClick={closeMenu}>Log in</Link><Link to="/signup" onClick={closeMenu}>Create an account</Link><button className="border-0 bg-transparent p-0 text-left font-bold text-nasi-blackberry-900" type="button" onClick={() => { closeMenu(); openPanel('account', menuButtonRef.current, 'likemarks'); }}>Likemarks</button></div>
      <p className="small-note">Nasi Fashion House · {location.pathname === '/' ? 'Style without compromise.' : 'Discover your next favorite.'}</p>
    </div>}
  </>;
}
