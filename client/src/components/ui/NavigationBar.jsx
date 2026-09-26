import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, UserRound, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { products } from '../../data/catalog';

export default function NavigationBar({ shopSearch, setShopSearch, shopSearchDocked, shopSearchDockRef, authOpen, previewProfile, onProfileClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const isShop = location.pathname === '/shop';
  const productSlug = location.pathname.startsWith('/product/') ? decodeURIComponent(location.pathname.slice('/product/'.length)) : null;
  const currentProduct = productSlug ? products.find((item) => item.slug === productSlug) : null;
  const showDockedSearch = (isHome || isShop) && shopSearchDocked;

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 bg-transparent">
      <nav className="mx-auto flex h-[88px] w-full max-w-[480px] items-center justify-between gap-2 px-5 pt-2" aria-label="Main navigation">
        <Link className={`brand-link flex h-[62px] shrink-0 items-center transition-[width] duration-300 ${showDockedSearch || currentProduct ? 'w-[74px]' : 'w-[112px]'}`} to="/" aria-label="Nasi Fashion House home">
          <img className="block w-full object-contain" src="/brand/NFH-logo.png" alt="Nasi Fashion House" />
        </Link>

        {currentProduct && (
          <div className="flex min-w-0 flex-1 items-center justify-center gap-1 text-[12px] text-white/80" aria-label={`Breadcrumb: Shop, ${currentProduct.name}`}>
            <Link className="shrink-0 hover:text-white" to="/shop">Shop</Link>
            <ChevronRight className="shrink-0 text-white/45" size={13} aria-hidden="true" />
            <span className="min-w-0 truncate font-semibold text-white" aria-current="page">{currentProduct.name}</span>
          </div>
        )}

        <AnimatePresence initial={false}>
          {showDockedSearch && (
            <motion.div className="search-field docked-search flex h-[48px] min-w-0 flex-1 items-center gap-1.5 px-3" initial={{ opacity: 0, y: 9, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -7, scale: 0.96 }} transition={{ duration: 0.22 }}>
              <input ref={shopSearchDockRef} className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-white outline-none placeholder:text-white/50" type="text" inputMode="search" placeholder="Search" value={shopSearch} onChange={(event) => setShopSearch(event.target.value)} onKeyDown={(event) => { if (isHome && event.key === 'Enter') { navigate('/shop'); window.scrollTo({ top: 0, behavior: 'auto' }); } }} aria-label="Search the collection" />
              {shopSearch && <button className="grid size-5 shrink-0 place-items-center rounded-full text-white/60" type="button" onClick={() => { setShopSearch(''); shopSearchDockRef.current?.focus(); }} aria-label="Clear search"><X size={15} aria-hidden="true" /></button>}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex shrink-0 items-center gap-2">
          <button className={`nav-circle grid size-[48px] place-items-center ${previewProfile ? 'is-signed-in' : ''}`} type="button" onClick={onProfileClick} aria-label={previewProfile ? 'Open profile preview' : 'Open sign in'} aria-haspopup="dialog" aria-expanded={authOpen}>
            <UserRound size={22} strokeWidth={previewProfile ? 2.1 : 1.7} aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  );
}
