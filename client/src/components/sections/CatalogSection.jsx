import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { categories } from '../../data/catalog';
import { storefrontApi } from '../../features/catalog/api';
import MerchCard from '../ui/MerchCard';

export default function CatalogSection({ sale = false }) {
  const [params, setParams] = useSearchParams();
  const [result, setResult] = useState({ status: 'loading', items: [], total: 0, hasMore: false });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const timer = useRef(null);
  const category = params.get('category') || 'all';
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'featured';
  const size = params.get('size') || '';
  const page = Math.max(1, Number(params.get('page')) || 1);

  function update(key, value) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value && value !== 'all' && value !== 'featured') next.set(key, value);
      else next.delete(key);
      if (key !== 'page') next.delete('page');
      return next;
    });
  }

  useEffect(() => {
    let alive = true;
    storefrontApi.getProducts({ categoryId: category, q, sort, size, page, onSale: sale })
      .then((data) => { if (alive) setResult({ ...data, status: 'success' }); })
      .catch(() => { if (alive) setResult({ status: 'error', items: [], total: 0, hasMore: false }); });
    return () => { alive = false; };
  }, [category, q, sort, size, page, sale]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  function search(value) {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => update('q', value.trim()), 250);
  }
  function clearAll() {
    setParams((current) => {
      const next = new URLSearchParams(current);
      ['category', 'q', 'size', 'sort', 'page'].forEach((key) => next.delete(key));
      return next;
    });
  }

  return <section className="catalog-section container min-h-screen">
    {sale ? <div className="catalog-banner"><div><span className="eyebrow light">THE SALE EDIT</span><h1>Good pieces, <em>worth finding.</em></h1><p>A thoughtful selection from our preview collection.</p></div><span className="catalog-banner-mark" aria-hidden="true">✳</span></div> : <div className="catalog-intro"><span className="eyebrow">DISCOVER YOUR NEXT FAVORITE</span><h1>The <em>collection.</em></h1><p>Pieces made for the way you move through every day.</p></div>}
    <div className="category-rail flex gap-2.5 overflow-x-auto" role="group" aria-label="Categories">{categories.map((item) => <button key={item.id} type="button" className={category === item.id ? 'active' : ''} onClick={() => update('category', item.id)} aria-pressed={category === item.id}>{item.name}</button>)}</div>
    <div className="catalog-search flex items-center gap-3 rounded-xl bg-white px-5"><Search size={20} /><input key={q} type="search" aria-label="Search products" placeholder="Search styles, colors, and more..." defaultValue={q} onChange={(event) => search(event.target.value)} />{q && <button type="button" onClick={() => update('q', '')} aria-label="Clear search"><X size={19} /></button>}</div>
    <div className="catalog-toolbar"><p><strong>{result.total}</strong> {result.total === 1 ? 'piece' : 'pieces'} to discover</p><div><button type="button" className="filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen}><SlidersHorizontal size={18} /> Filters {size && <span className="filter-count">1</span>}</button><label className="sort-control">Sort by <select value={sort} onChange={(event) => update('sort', event.target.value)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label></div></div>
    {filtersOpen && <div className="filter-tray"><span>Size</span><div className="filter-sizes">{['XS', 'S', 'M', 'L', 'XL'].map((item) => <button key={item} type="button" className={size === item ? 'active' : ''} aria-pressed={size === item} onClick={() => update('size', size === item ? '' : item)}>{item}</button>)}</div><button type="button" className="text-link" onClick={clearAll}>Clear all</button></div>}
    {result.status === 'loading' && <div className="merch-grid grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-6 xl:grid-cols-4" aria-label="Loading products">{Array.from({ length: 8 }, (_, index) => <div className="merch-skeleton" key={index} />)}</div>}
    {result.status === 'error' && <div className="catalog-empty"><h2>We could not load the collection.</h2><p>Try refreshing the page.</p><button className="button button-dark" type="button" onClick={() => window.location.reload()}>Try again</button></div>}
    {result.status === 'success' && (result.items.length ? <><div className="merch-grid grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-6 xl:grid-cols-4">{result.items.map((product) => <MerchCard key={product.id} product={product} />)}</div>{result.hasMore && <div className="load-more"><button className="button button-outline" type="button" onClick={() => update('page', String(page + 1))}>Load more pieces <ArrowRight size={18} /></button></div>}</> : <div className="catalog-empty"><span className="empty-icon">✳</span><h2>No pieces found.</h2><p>Try a different search or clear the filters.</p><button className="button button-dark" type="button" onClick={clearAll}>Clear filters</button></div>)}
    <p className="catalog-disclaimer">Preview catalog · Product details, availability, and prices are sample content.</p>
  </section>;
}
