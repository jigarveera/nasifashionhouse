import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpAZ, ArrowUpWideNarrow, Check, IndianRupee, X } from 'lucide-react';
import { mobileCategories, toggleCategorySelection } from '../../data/mobileCategories';
import Slider from './Slider';

const sortOptions = [
  { id: 'az', label: 'A–Z', icon: ArrowDownAZ },
  { id: 'za', label: 'Z–A', icon: ArrowUpAZ },
  { id: 'price-asc', label: 'Price: low to high', icon: ArrowDownWideNarrow },
  { id: 'price-desc', label: 'Price: high to low', icon: ArrowUpWideNarrow },
];

export default function ShopFilterSheet({ categories, priceRange, priceCeiling, sortBy, onApply, onClose }) {
  const [draftCategories, setDraftCategories] = useState(categories);
  const [draftPrice, setDraftPrice] = useState([priceRange.min, priceRange.max]);
  const [draftSort, setDraftSort] = useState(sortBy);
  const sheetRef = useRef(null);
  const closeRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !sheetRef.current) return;
      const focusable = [...sheetRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), [role="slider"]')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  function applyFilters() {
    onApply({ categories: draftCategories, priceRange: { min: draftPrice[0], max: draftPrice[1] }, sortBy: draftSort });
  }

  function clearDraft() {
    setDraftCategories(['all']);
    setDraftPrice([0, priceCeiling]);
    setDraftSort('featured');
  }

  return (
    <motion.div className="filter-overlay fixed inset-0 z-[100] flex items-end justify-center bg-black/65" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <motion.div ref={sheetRef} className="filter-sheet flex max-h-[88dvh] w-full max-w-[480px] flex-col rounded-t-[30px] text-white" role="dialog" aria-modal="true" aria-labelledby="filter-sheet-title" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: reducedMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}>
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-white/30" aria-hidden="true" />
        <div className="flex shrink-0 items-center justify-between px-5 pb-4 pt-5">
          <h2 id="filter-sheet-title" className="m-0 text-[25px] font-semibold">Filter by</h2>
          <button ref={closeRef} className="filter-close grid size-9 place-items-center rounded-full" type="button" onClick={onClose} aria-label="Close filters"><X size={20} aria-hidden="true" /></button>
        </div>

        <div className="filter-sheet-content flex-1 overflow-y-auto px-5 pb-6">
          <fieldset className="border-0 p-0">
            <legend className="mb-3 text-[16px] font-semibold">Category</legend>
            <div className="flex flex-wrap gap-2">
              {mobileCategories.map((category) => {
                const selected = draftCategories.includes(category.id);
                const Icon = category.icon;
                return <button key={category.id} className={`filter-choice flex min-h-10 items-center gap-2 rounded-full py-1 pl-1 pr-3 text-left text-[13px] ${selected ? 'is-active' : ''}`} type="button" onClick={() => setDraftCategories((current) => toggleCategorySelection(current, category.id))} aria-pressed={selected}>
                  <span className="category-pill-icon grid size-8 shrink-0 place-items-center rounded-full"><Icon size={16} strokeWidth={1.6} aria-hidden="true" /></span>
                  <span className="leading-tight">{category.name}</span>
                  {selected && (category.id === 'all' ? <Check size={14} className="ml-0.5 shrink-0" aria-hidden="true" /> : <X size={14} className="ml-0.5 shrink-0" aria-hidden="true" />)}
                </button>;
              })}
            </div>
          </fieldset>

          <fieldset className="mt-7 border-0 p-0">
            <legend className="mb-3 text-[16px] font-semibold">Price range</legend>
            <div className="rounded-[20px] border border-white/10 bg-white/[0.04] px-5 pb-4 pt-6">
              <Slider className="price-slider" value={draftPrice} onValueChange={setDraftPrice} min={0} max={priceCeiling} step={100} minStepsBetweenThumbs={1} aria-label="Price range" />
              <div className="mt-5 flex justify-between text-[13px] font-medium text-white/75">
                <span className="inline-flex items-center"><IndianRupee size={13} aria-hidden="true" />{draftPrice[0].toLocaleString('en-IN')}</span>
                <span className="inline-flex items-center"><IndianRupee size={13} aria-hidden="true" />{draftPrice[1].toLocaleString('en-IN')}</span>
              </div>
            </div>
          </fieldset>

          <fieldset className="mt-7 border-0 p-0">
            <legend className="mb-3 text-[16px] font-semibold">Sort by</legend>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Sort products by">
              {sortOptions.map((option) => <button key={option.id} className={`filter-choice flex min-h-11 items-center justify-between gap-2 rounded-full px-3 text-left text-[13px] ${draftSort === option.id ? 'is-active' : ''}`} type="button" onClick={() => setDraftSort(option.id)} role="radio" aria-checked={draftSort === option.id}>
                <option.icon size={16} className="shrink-0" aria-hidden="true" />
                <span className="leading-tight">{option.label}</span>
                {draftSort === option.id && <Check size={16} className="shrink-0" aria-hidden="true" />}
              </button>)}
            </div>
          </fieldset>
        </div>

        <div className="filter-sheet-footer flex shrink-0 items-center gap-3 px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4">
          <button className="h-11 flex-1 rounded-full border border-white/25 text-[14px] font-semibold" type="button" onClick={clearDraft}>Clear all</button>
          <button className="filter-apply h-11 flex-[1.4] rounded-full text-[14px] font-bold text-white" type="button" onClick={applyFilters}>Apply filters</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
