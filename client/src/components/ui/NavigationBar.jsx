import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronRight, Search, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { products } from '../../data/catalog';

export default function NavigationBar({ shopSearch, setShopSearch, shopSearchDocked, shopSearchMainRef, shopSearchDockRef }) {
  const location = useLocation();
  const isShop = location.pathname === '/shop';
  const productSlug = location.pathname.startsWith('/product/') ? decodeURIComponent(location.pathname.slice('/product/'.length)) : null;
  const currentProduct = productSlug ? products.find((item) => item.slug === productSlug) : null;
  const showDockedSearch = isShop && shopSearchDocked;

  function handleSearchClick(event) {
    if (!isShop) return;
    event.preventDefault();
    (showDockedSearch ? shopSearchDockRef : shopSearchMainRef).current?.focus();
  }

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
              <input ref={shopSearchDockRef} className="min-w-0 flex-1 border-0 bg-transparent text-[13px] text-white outline-none placeholder:text-white/50" type="text" inputMode="search" placeholder="Search" value={shopSearch} onChange={(event) => setShopSearch(event.target.value)} aria-label="Search the collection" />
              {shopSearch && <button className="grid size-5 shrink-0 place-items-center rounded-full text-white/60" type="button" onClick={() => { setShopSearch(''); shopSearchDockRef.current?.focus(); }} aria-label="Clear search"><X size={15} aria-hidden="true" /></button>}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex shrink-0 items-center gap-2">
          <Link className="nav-circle grid size-[48px] place-items-center" to="/shop" onClick={handleSearchClick} aria-label="Search the shop" aria-current={isShop ? 'page' : undefined}>
            <Search size={22} strokeWidth={1.7} aria-hidden="true" />
          </Link>
          <span className="nav-circle relative grid size-[48px] place-items-center" aria-label="Notifications coming soon" role="img">
            <Bell size={22} strokeWidth={1.7} aria-hidden="true" />
            <span className="absolute right-[11px] top-[10px] size-1.5 rounded-full bg-white" aria-hidden="true" />
          </span>
        </div>
      </nav>
    </header>
  );
}
