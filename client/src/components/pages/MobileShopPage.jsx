import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpAZ, ArrowUpWideNarrow, ChevronDown, IndianRupee, Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../../data/catalog';
import { mobileCategories, productMatchesCategories } from '../../data/mobileCategories';
import MobileMerchCard from '../ui/MobileMerchCard';
import ShopFilterSheet from '../ui/ShopFilterSheet';

const PRICE_CEILING = Math.ceil(Math.max(...products.map((product) => product.variants[0].price.amountPaise / 100)) / 1000) * 1000;
const sortOptions = {
  az: { label: 'A–Z', icon: ArrowDownAZ },
  za: { label: 'Z–A', icon: ArrowUpAZ },
  'price-asc': { label: 'Price: low to high', icon: ArrowDownWideNarrow },
  'price-desc': { label: 'Price: high to low', icon: ArrowUpWideNarrow },
};

export default function MobileShopPage({ bagQuantities, changeQuantity, favorites, toggleFavorite, search, setSearch, searchDocked, setSearchDocked, searchMainRef }) {
  const [params, setParams] = useSearchParams();
  const requestedCategories = (params.get('category') || '').split(',').filter((id) => mobileCategories.some((item) => item.id === id && id !== 'all'));
  const selectedCategories = requestedCategories.length ? [...new Set(requestedCategories)] : ['all'];
  const [priceRange, setPriceRange] = useState({ min: 0, max: PRICE_CEILING });
  const [sortBy, setSortBy] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRowRef = useRef(null);
  const resultsRef = useRef(null);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);

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

  function updateCategories(categories) {
    setParams((current) => {
      const updated = new URLSearchParams(current);
      if (categories.includes('all')) updated.delete('category');
      else updated.set('category', categories.join(','));
      return updated;
    });
  }

  function applyFilters(next) {
    updateCategories(next.categories);
    setPriceRange(next.priceRange);
    setSortBy(next.sortBy);
    setFiltersOpen(false);
  }

  function removeCategory(id) {
    const next = selectedCategories.filter((category) => category !== id);
    updateCategories(next.length ? next : ['all']);
  }

  const query = search.trim().toLocaleLowerCase();
  const visibleProducts = products.filter((product) => {
    const price = product.variants[0].price.amountPaise / 100;
    const matchesSearch = !query || [product.name, product.description, ...product.tags].join(' ').toLocaleLowerCase().includes(query);
    return productMatchesCategories(product, selectedCategories) && matchesSearch && price >= priceRange.min && price <= priceRange.max;
  });
  if (sortBy === 'price-asc') visibleProducts.sort((a, b) => a.variants[0].price.amountPaise - b.variants[0].price.amountPaise);
  else if (sortBy === 'price-desc') visibleProducts.sort((a, b) => b.variants[0].price.amountPaise - a.variants[0].price.amountPaise);
  else if (sortBy === 'az') visibleProducts.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === 'za') visibleProducts.sort((a, b) => b.name.localeCompare(a.name));
  else visibleProducts.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  const productColumns = [visibleProducts.filter((_, index) => index % 2 === 0), visibleProducts.filter((_, index) => index % 2 === 1)];

  const priceFiltered = priceRange.min > 0 || priceRange.max < PRICE_CEILING;
  const filterCount = Number(!selectedCategories.includes('all')) + Number(priceFiltered) + Number(sortBy !== 'featured');

  return (
    <main className="mobile-page responsive-page mx-auto min-h-screen max-w-[480px] pb-16 pt-[108px]" aria-label="Shop page">
      <h1 className="hero-gradient-title mb-6 text-[34px] leading-none font-semibold tracking-[-0.035em]">Find your style.</h1>

      <motion.div ref={searchRowRef} className="page-search-row mb-5 flex items-center gap-2.5" animate={{ opacity: searchDocked ? 0.35 : 1 }} transition={{ duration: 0.2 }}>
        <div className="search-field flex h-[52px] min-w-0 flex-1 items-center gap-2 rounded-full px-5">
          <input ref={searchMainRef} className="w-full min-w-0 flex-1 border-0 bg-transparent text-[15px] text-white outline-none placeholder:text-white/50" type="text" inputMode="search" placeholder="Search the collection" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search the collection" />
          {search && <button className="grid size-7 shrink-0 place-items-center rounded-full text-white/55" type="button" onClick={() => { setSearch(''); searchMainRef.current?.focus(); }} aria-label="Clear search"><X size={19} aria-hidden="true" /></button>}
        </div>
        <button className="nav-circle grid size-[52px] shrink-0 place-items-center" type="button" onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} aria-label="Show search results"><Search size={21} strokeWidth={1.7} aria-hidden="true" /></button>
      </motion.div>

      <div className="selection-bar mb-6 flex min-h-[48px] items-center gap-2">
        <div className="selection-chips flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
          {selectedCategories.includes('all') && !priceFiltered && sortBy === 'featured' ? <span className="text-[13px] text-white/50">Explore every style</span> : <>
            {!selectedCategories.includes('all') && selectedCategories.map((id) => {
              const category = mobileCategories.find((item) => item.id === id);
              const Icon = category?.icon;
              return <button key={id} className="filter-chip inline-flex h-10 shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-[12px]" type="button" onClick={() => removeCategory(id)} aria-label={`Remove ${category?.name || id} filter`}>
                {Icon && <span className="filter-chip-icon"><Icon size={14} strokeWidth={1.7} aria-hidden="true" /></span>}
                {category?.name || id}<X className="filter-chip-close" size={14} aria-hidden="true" />
              </button>;
            })}
            {priceFiltered && <button className="filter-chip inline-flex h-10 shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-[12px]" type="button" onClick={() => setPriceRange({ min: 0, max: PRICE_CEILING })} aria-label="Remove price filter"><span className="filter-chip-icon"><IndianRupee size={14} aria-hidden="true" /></span>{priceRange.min.toLocaleString('en-IN')}–{priceRange.max.toLocaleString('en-IN')}<X className="filter-chip-close" size={14} aria-hidden="true" /></button>}
            {sortBy !== 'featured' && (() => {
              const option = sortOptions[sortBy];
              const Icon = option?.icon;
              return <button className="filter-chip inline-flex h-10 shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-[12px]" type="button" onClick={() => setSortBy('featured')} aria-label="Remove sort filter"><span className="filter-chip-icon">{Icon && <Icon size={14} aria-hidden="true" />}</span>{option?.label}<X className="filter-chip-close" size={14} aria-hidden="true" /></button>;
            })()}
          </>}
        </div>
        <button className="filter-trigger inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-3 text-[13px] font-semibold" type="button" onClick={() => setFiltersOpen(true)} aria-haspopup="dialog" aria-expanded={filtersOpen}>
          <SlidersHorizontal size={16} strokeWidth={1.8} aria-hidden="true" /> Filters{filterCount > 0 ? ` (${filterCount})` : ''} <ChevronDown size={15} strokeWidth={1.7} aria-hidden="true" />
        </button>
      </div>

      <section ref={resultsRef} className="shop-results" aria-labelledby="shop-results-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 id="shop-results-heading" className="m-0 text-[23px] font-medium">Pieces for you</h2>
          <span className="shrink-0 text-[13px] text-white/50">{visibleProducts.length} pieces</span>
        </div>
        {visibleProducts.length ? (<>
          <div className="shop-product-grid relative grid grid-cols-2 gap-x-4">
            <svg className="pointer-events-none absolute -top-1 right-0 z-10 h-[72px] w-[84px] text-white" viewBox="0 0 100 90" fill="none" aria-hidden="true">
              <path d="M16 6c14-4 30 7 38 19 6 9 5 17-3 19-8 2-19-6-21-15-2-8 4-14 13-13 16 2 35 19 32 37-2 11-12 20-23 26" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m54 68-3 12 12-4" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {productColumns.map((column, index) => <div className="shop-product-column" key={index}>
              {column.map((product) => <MobileMerchCard key={product.id} className="shop-merch-card" product={product} quantity={bagQuantities[product.id] || 0} favorite={Boolean(favorites[product.id])} onQuantityChange={changeQuantity} onToggleFavorite={toggleFavorite} />)}
            </div>)}
          </div>
          <div className="shop-product-grid-desktop">
            {visibleProducts.map((product) => <MobileMerchCard key={product.id} className="shop-merch-card" product={product} quantity={bagQuantities[product.id] || 0} favorite={Boolean(favorites[product.id])} onQuantityChange={changeQuantity} onToggleFavorite={toggleFavorite} />)}
          </div>
        </>) : (
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-9 text-center">
            <p className="m-0 text-[17px] font-medium">No pieces found.</p>
            <p className="mt-2 mb-0 text-[14px] text-white/55">Try another search or change your filters.</p>
          </div>
        )}
      </section>

      <AnimatePresence>
        {filtersOpen && <ShopFilterSheet categories={selectedCategories} priceRange={priceRange} priceCeiling={PRICE_CEILING} sortBy={sortBy} onApply={applyFilters} onClose={closeFilters} />}
      </AnimatePresence>
    </main>
  );
}
