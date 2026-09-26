import { useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { ChevronRight, Heart, House, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { products } from '../../data/catalog';

export default function NavigationBar({ shopSearch, setShopSearch, shopSearchDocked, shopSearchDockRef, authOpen, previewProfile, onProfileClick, activePanel, onOpenPanel, onClosePanel, cartCount, wishlistCount }) {
  const location = useLocation();
  const navigate = useNavigate();
  const desktopSearchRef = useRef(null);
  const desktopRailRef = useRef(null);
  const suppressNavClickRef = useRef(false);
  const selectorOffset = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const [isDraggingSelector, setIsDraggingSelector] = useState(false);
  const isHome = location.pathname === '/';
  const isShop = location.pathname === '/shop';
  const productSlug = location.pathname.startsWith('/product/') ? decodeURIComponent(location.pathname.slice('/product/'.length)) : null;
  const currentProduct = productSlug ? products.find((item) => item.slug === productSlug) : null;
  const showDockedSearch = (isHome || isShop) && shopSearchDocked;
  const activeDesktopTab = activePanel === 'wishlist' ? 1 : activePanel === 'cart' ? 2 : isHome ? 0 : -1;

  function selectDesktopTab(index, fromDrag = false) {
    if (suppressNavClickRef.current && !fromDrag) return;
    if (index === 0) {
      onClosePanel();
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else onOpenPanel(index === 1 ? 'wishlist' : 'cart');
  }

  function moveDesktopSelector(offset) {
    if (activeDesktopTab < 0 || !desktopRailRef.current) return;
    const railWidth = desktopRailRef.current.clientWidth;
    const tabWidth = (railWidth - 8) / 3;
    const start = 4 + activeDesktopTab * tabWidth;
    selectorOffset.set(Math.max(4 - start, Math.min(railWidth - 4 - tabWidth - start, offset)));
  }

  function finishDesktopSelectorDrag(_, info) {
    setIsDraggingSelector(false);
    animate(selectorOffset, 0, { type: 'spring', stiffness: 310, damping: 19 });
    if (Math.abs(info.offset.x) < 12 || activeDesktopTab < 0) return;
    const bounds = desktopRailRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const index = Math.max(0, Math.min(2, Math.floor((info.point.x - bounds.left) / (bounds.width / 3))));
    suppressNavClickRef.current = true;
    selectDesktopTab(index, true);
    window.setTimeout(() => { suppressNavClickRef.current = false; }, 220);
  }

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 bg-transparent">
      <nav className="top-nav-inner mx-auto flex h-[88px] w-full max-w-[480px] items-center justify-between gap-2 px-5 pt-2" aria-label="Main navigation">
        <Link className={`brand-link flex h-[62px] shrink-0 items-center transition-[width] duration-300 ${showDockedSearch || currentProduct ? 'w-[74px]' : 'w-[112px]'}`} to="/" aria-label="Nasi Fashion House home">
          <img className="block w-full object-contain" src="/brand/NFH-logo.png" alt="Nasi Fashion House" />
        </Link>

        {currentProduct && (
          <div className="mobile-nav-breadcrumb flex min-w-0 flex-1 items-center justify-center gap-1 text-[12px] text-white/80" aria-label={`Breadcrumb: Shop, ${currentProduct.name}`}>
            <Link className="shrink-0 hover:text-white" to="/shop">Shop</Link>
            <ChevronRight className="shrink-0 text-white/45" size={13} aria-hidden="true" />
            <span className="min-w-0 truncate font-semibold text-white" aria-current="page">{currentProduct.name}</span>
          </div>
        )}

        <AnimatePresence initial={false}>
          {showDockedSearch && (
            <motion.div className="search-field docked-search mobile-docked-search flex h-[48px] min-w-0 flex-1 items-center gap-1.5 px-3" initial={{ opacity: 0, y: 9, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -7, scale: 0.96 }} transition={{ duration: 0.22 }}>
              <input ref={shopSearchDockRef} className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-white outline-none placeholder:text-white/50" type="text" inputMode="search" placeholder="Search" value={shopSearch} onChange={(event) => setShopSearch(event.target.value)} onKeyDown={(event) => { if (isHome && event.key === 'Enter') { navigate('/shop'); window.scrollTo({ top: 0, behavior: 'auto' }); } }} aria-label="Search the collection" />
              {shopSearch && <button className="grid size-5 shrink-0 place-items-center rounded-full text-white/60" type="button" onClick={() => { setShopSearch(''); shopSearchDockRef.current?.focus(); }} aria-label="Clear search"><X size={15} aria-hidden="true" /></button>}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div ref={desktopRailRef} className="desktop-nav-center" aria-label="Browse" style={{ touchAction: 'pan-y' }} onPanStart={() => { if (activeDesktopTab >= 0) setIsDraggingSelector(true); }} onPan={(_, info) => moveDesktopSelector(info.offset.x)} onPanEnd={finishDesktopSelectorDrag}>
          <motion.div className="desktop-nav-selector" style={{ x: selectorOffset }} animate={{ left: ['4px', 'calc(33.333% + 1.333px)', 'calc(66.666% - 1.333px)'][Math.max(0, activeDesktopTab)], opacity: activeDesktopTab < 0 ? 0 : 1, scaleX: isDraggingSelector && !reducedMotion ? 1.08 : 1, scaleY: isDraggingSelector && !reducedMotion ? .93 : 1 }} transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 20 }} aria-hidden="true" />
          <button className={`desktop-nav-link ${activeDesktopTab === 0 ? 'is-active' : ''}`} type="button" onClick={() => selectDesktopTab(0)} aria-current={activeDesktopTab === 0 ? 'page' : undefined}><House size={18} aria-hidden="true" /><span>Home</span></button>
          <button className={`desktop-nav-link ${activeDesktopTab === 1 ? 'is-active' : ''}`} type="button" onClick={() => selectDesktopTab(1)} aria-label={`Wishlist, ${wishlistCount} saved items`} aria-haspopup="dialog" aria-expanded={activePanel === 'wishlist'}><Heart size={18} aria-hidden="true" /><span>Wishlist</span><small aria-hidden="true">{wishlistCount}</small></button>
          <button className={`desktop-nav-link ${activeDesktopTab === 2 ? 'is-active' : ''}`} type="button" onClick={() => selectDesktopTab(2)} aria-label={`Cart, ${cartCount} items`} aria-haspopup="dialog" aria-expanded={activePanel === 'cart'}><ShoppingBag size={18} aria-hidden="true" /><span>Cart</span><small aria-hidden="true">{cartCount}</small></button>
        </motion.div>

        <div className="top-nav-actions flex shrink-0 items-center gap-2">
          <div className="desktop-search-group">
            <div className={`desktop-nav-search search-field ${isShop && !activePanel ? 'is-active' : ''}`}>
              <input ref={desktopSearchRef} type="search" inputMode="search" placeholder="Search styles" value={shopSearch} onFocus={() => { if (!isShop) navigate('/shop'); }} onChange={(event) => { setShopSearch(event.target.value); if (!isShop) navigate('/shop'); }} onKeyDown={(event) => { if (event.key === 'Enter') navigate('/shop'); }} aria-label="Search the collection" />
              {shopSearch && <button type="button" onClick={() => { setShopSearch(''); desktopSearchRef.current?.focus(); }} aria-label="Clear search"><X size={17} aria-hidden="true" /></button>}
            </div>
            <button className="nav-circle desktop-search-submit" type="button" onClick={() => { navigate('/shop'); desktopSearchRef.current?.focus(); }} aria-label="Search the shop"><Search size={20} strokeWidth={1.7} aria-hidden="true" /></button>
          </div>
          <button className={`nav-circle grid size-[48px] place-items-center ${previewProfile ? 'is-signed-in' : ''}`} type="button" onClick={onProfileClick} aria-label={previewProfile ? 'Open profile preview' : 'Open sign in'} aria-haspopup="dialog" aria-expanded={authOpen}>
            <UserRound size={22} strokeWidth={previewProfile ? 2.1 : 1.7} aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  );
}
