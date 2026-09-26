import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../../data/catalog';
import CategoryRail from '../ui/CategoryRail';
import MerchRow from '../ui/MerchRow';
import PromoCarousel from '../ui/PromoCarousel';
import FAQ from '../sections/FAQ';
import QuoteSection from '../sections/QuoteSection';

export default function MobileHomePage({ bagQuantities, changeQuantity, favorites, toggleFavorite, search, setSearch, searchDocked, setSearchDocked, searchMainRef }) {
  const navigate = useNavigate();
  const searchRowRef = useRef(null);
  const merchandiseActions = { bagQuantities, changeQuantity, favorites, toggleFavorite };
  const trending = products.filter((product) => product.published && product.categoryId !== 'accessories');
  const shirts = products.filter((product) => product.categoryId === 'shirts');
  const pants = products.filter((product) => product.categoryId === 'pants');

  useEffect(() => {
    let frame = 0;
    function updateDocked() {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const row = searchRowRef.current;
        if (row) setSearchDocked(row.getBoundingClientRect().bottom <= 88);
      });
    }
    updateDocked();
    window.addEventListener('scroll', updateDocked, { passive: true });
    window.addEventListener('resize', updateDocked);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateDocked);
      window.removeEventListener('resize', updateDocked);
    };
  }, [setSearchDocked]);

  function openShop() {
    navigate('/shop');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  return (
    <main className="mobile-page responsive-page mx-auto min-h-screen max-w-[480px] pb-16 pt-[108px]" aria-label="Home page">
      <h1 className="sr-only">Nasi Fashion House</h1>
      <motion.div ref={searchRowRef} className="page-search-row mb-5 flex items-center gap-2.5" animate={{ opacity: searchDocked ? 0.35 : 1 }} transition={{ duration: 0.2 }}>
        <div className="search-field flex h-[52px] min-w-0 flex-1 items-center gap-2 rounded-full px-5">
          <input ref={searchMainRef} className="w-full min-w-0 flex-1 border-0 bg-transparent text-[15px] text-white outline-none placeholder:text-white/50" type="text" inputMode="search" placeholder="Search the collection" value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') openShop(); }} aria-label="Search the collection" />
          {search && <button className="grid size-7 shrink-0 place-items-center rounded-full text-white/55" type="button" onClick={() => { setSearch(''); searchMainRef.current?.focus(); }} aria-label="Clear search"><X size={19} aria-hidden="true" /></button>}
        </div>
        <button className="nav-circle grid size-[52px] shrink-0 place-items-center" type="button" onClick={openShop} aria-label="Search the shop"><Search size={21} strokeWidth={1.7} aria-hidden="true" /></button>
      </motion.div>

      <PromoCarousel />

      <section className="mt-8" aria-labelledby="category-heading">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="category-heading" className="m-0 text-[23px] leading-none font-medium text-white">Category</h2>
          <Link className="text-[14px] text-white/55" to="/shop">See All</Link>
        </div>
        <CategoryRail navigation />
      </section>

      <MerchRow title="Trending collection" products={trending} {...merchandiseActions} />
      <MerchRow title="Shirts & Blouses" products={shirts} {...merchandiseActions} />
      <MerchRow title="Pants & Denim" products={pants} {...merchandiseActions} />
      <QuoteSection />
      <FAQ />
    </main>
  );
}
