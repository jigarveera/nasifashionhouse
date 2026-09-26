import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Heart, Info, Maximize2, Minus, Plus, Share2, ShoppingBag, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { categories, products } from '../../data/catalog';
import { getProductCare } from '../../data/productCare';
import MerchRow from '../ui/MerchRow';
import ChatFAQ from '../ui/ChatFAQ';

const formatPrice = (amountPaise) => `₹${(amountPaise / 100).toLocaleString('en-IN')}`;
const sizeNames = { XS: 'Extra small', S: 'Small', M: 'Medium', L: 'Large', XL: 'Extra large' };

function localImage(url) {
  const photoId = url.match(/photo-[^?]+/)?.[0];
  return photoId ? `/images/${photoId}.jpg` : url;
}

function ProductDetails({ product, bagQuantities, bagLines, changeQuantity, favorites, toggleFavorite }) {
  const reducedMotion = useReducedMotion();
  const heartGradientId = `product-heart-${useId().replace(/[^a-z0-9]/gi, '')}`;
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [galleryInteracted, setGalleryInteracted] = useState(false);
  const [selectedSize, setSelectedSize] = useState(() => product.variants.find((variant) => variant.size === 'M' && variant.available)?.size || product.variants.find((variant) => variant.available)?.size || 'One size');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const touchStartRef = useRef(null);
  const colorOptions = product.colorways;
  const selectedColor = colorOptions[selectedColorIndex] || colorOptions[0];
  const colorVariants = product.variants.filter((variant) => variant.colorId === selectedColor.id);
  const selectedVariant = colorVariants.find((variant) => (variant.size || 'One size') === selectedSize && variant.available) || colorVariants.find((variant) => variant.available) || colorVariants[0];
  const colorGallery = selectedColor.images.map((image, index) => ({ src: localImage(image.url), alt: image.alt, position: 'center center', scale: 1, label: `View ${index + 1}` }));
  const gallery = colorGallery.length > 2 ? colorGallery : [
    { ...colorGallery[0], label: 'Full view' },
    { ...colorGallery[1], position: '44% 35%', scale: 1.18, label: 'Closer view' },
    { ...colorGallery[0], position: '62% 62%', scale: 1.4, label: 'Detail view' },
    { ...colorGallery[1], position: '55% 16%', scale: 1.58, label: 'Upper detail' },
    { ...colorGallery[0], position: '45% 82%', scale: 1.48, label: 'Lower detail' },
  ];
  const quantity = bagLines[selectedVariant.id] || 0;
  const favorite = Boolean(favorites[product.id]);
  const category = categories.find((item) => item.id === product.categoryId)?.name || product.categoryId;
  const care = getProductCare(product);
  const materialAnswer = care.material.startsWith('See') ? `${care.material}.` : `The material is ${care.material.toLowerCase()}.`;
  const availableSizes = colorVariants.filter((variant) => variant.available).map((variant) => variant.size || 'One size');
  const faqItems = [
    { question: `What is ${product.name} made from?`, answer: materialAnswer },
    { question: 'How do I wash and iron it?', answer: `${care.washing} ${care.ironing}` },
    { question: 'Which sizes are available?', answer: availableSizes.length === 1 ? `This piece is available in ${availableSizes[0]}.` : `This piece is available in ${availableSizes.join(', ')}. Tap the info icon beside Size to see the size guide.` },
  ];
  const similar = products.filter((item) => item.published && item.id !== product.id && item.categoryId === product.categoryId);
  const trending = products.filter((item) => item.published && item.isFeatured && item.id !== product.id);
  const merchActions = { bagQuantities, changeQuantity, favorites, toggleFavorite };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.title = `${product.name} | Nasi Fashion House`;
    return () => { document.title = 'Nasi Fashion House'; };
  }, [product.name]);

  useEffect(() => {
    if (galleryInteracted || reducedMotion) return undefined;
    const timer = window.setInterval(() => setActiveImage((current) => (current + 1) % gallery.length), 4500);
    return () => window.clearInterval(timer);
  }, [galleryInteracted, reducedMotion, gallery.length]);

  useEffect(() => {
    if (!detailsOpen && !expanded) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setDetailsOpen(false);
        setExpanded(false);
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll('button:not([disabled]), a[href]')];
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
  }, [detailsOpen, expanded]);

  useEffect(() => {
    if (!shareStatus) return undefined;
    const timer = window.setTimeout(() => setShareStatus(''), 3000);
    return () => window.clearTimeout(timer);
  }, [shareStatus]);

  async function shareProduct() {
    setGalleryInteracted(true);
    const url = new URL(`/product/${encodeURIComponent(product.slug)}`, window.location.origin).href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${product.name} | Nasi Fashion House`, text: product.description, url });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('Product link copied');
    } catch {
      setShareStatus('Unable to copy the link');
    }
  }

  function chooseImage(index) {
    setActiveImage(index);
    setGalleryInteracted(true);
  }

  function finishSwipe(event) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const deltaX = event.changedTouches[0].clientX - start.x;
    const deltaY = event.changedTouches[0].clientY - start.y;
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      chooseImage((activeImage + (deltaX < 0 ? 1 : gallery.length - 1)) % gallery.length);
    }
  }

  function quantityControl() {
    return quantity ? (
      <div className="merch-quantity product-quantity-cta grid h-[34px] w-[144px] shrink-0 grid-cols-[1fr_auto_1fr] items-center rounded-full px-2 font-semibold text-white" role="group" aria-label={`${product.name} quantity`}>
        <button className="grid size-7 place-items-center justify-self-start rounded-full" type="button" onClick={() => changeQuantity(product.id, -1, selectedVariant.id)} aria-label={`Remove one ${product.name}`}><Minus size={16} aria-hidden="true" /></button>
        <span className="min-w-4 text-center text-[14px] font-semibold" aria-live="polite">{quantity}</span>
        <button className="grid size-7 place-items-center justify-self-end rounded-full" type="button" onClick={() => changeQuantity(product.id, 1, selectedVariant.id)} aria-label={`Add one ${product.name}`}><Plus size={16} aria-hidden="true" /></button>
      </div>
    ) : (
      <button className="merch-add product-purchase-cta inline-flex h-[34px] w-[144px] shrink-0 items-center justify-center gap-2 rounded-full px-[14px] text-[12px] font-semibold tracking-[0.04em] whitespace-nowrap text-white uppercase disabled:opacity-45" type="button" disabled={!selectedVariant?.available} onClick={() => changeQuantity(product.id, 1, selectedVariant.id)} aria-label={`Add ${product.name} in size ${selectedVariant?.size || 'one size'} to bag`}>
        Add to bag <ShoppingBag className="shrink-0" size={16} strokeWidth={1.8} aria-hidden="true" />
      </button>
    );
  }

  function sizeOptions() {
    return colorVariants.map((variant) => (
      <button
        key={variant.id}
        className={`product-size grid size-[34px] shrink-0 place-items-center rounded-full text-[12px] font-semibold ${selectedVariant.id === variant.id ? 'is-selected' : ''}`}
        type="button"
        disabled={!variant.available}
        onClick={() => setSelectedSize(variant.size || 'One size')}
        aria-label={`Size ${variant.size || 'One size'}`}
        aria-pressed={selectedVariant.id === variant.id}
      >{variant.size || 'OS'}</button>
    ));
  }

  return (
    <main className="mobile-page mx-auto min-h-screen max-w-[480px] pb-16 pt-[102px]" aria-label={`${product.name} product page`}>
      <section aria-label={`${product.name} images`}>
        <div className="relative aspect-square overflow-hidden rounded-[24px]" onClick={() => setGalleryInteracted(true)} onTouchStart={(event) => { touchStartRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={finishSwipe}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={`${selectedColor.id}-${activeImage}`}
              className="absolute inset-0 h-full w-full object-cover"
              src={gallery[activeImage].src}
              alt={gallery[activeImage].alt}
              style={{ objectPosition: gallery[activeImage].position, transform: `scale(${gallery[activeImage].scale})` }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.35 }}
            />
          </AnimatePresence>
          <button className="product-image-action absolute left-3 top-3 grid size-10 place-items-center rounded-full" type="button" onClick={() => { setGalleryInteracted(true); setExpanded(true); }} aria-label="Expand product image"><Maximize2 size={18} strokeWidth={1.7} aria-hidden="true" /></button>
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <button className="product-image-action relative grid size-10 place-items-center rounded-full" type="button" onClick={() => toggleFavorite(product.id)} aria-label={favorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`} aria-pressed={favorite}>
              <Heart size={21} strokeWidth={1.7} stroke={favorite ? `url(#${heartGradientId})` : 'currentColor'} fill={favorite ? `url(#${heartGradientId})` : 'none'} aria-hidden="true">
                <defs><linearGradient id={heartGradientId} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#dfa9f0" /><stop offset="100%" stopColor="#bb58d8" /></linearGradient></defs>
              </Heart>
              {favorite && <span className="heart-burst" aria-hidden="true">{[0, 1, 2, 3].map((index) => <span key={index}>♥</span>)}</span>}
            </button>
            <button className="product-image-action grid size-10 place-items-center rounded-full" type="button" onClick={shareProduct} aria-label={`Share ${product.name}`}><Share2 size={19} strokeWidth={1.7} aria-hidden="true" /></button>
          </div>
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3" role="group" aria-label="Choose product color">
            {colorOptions.map((color, index) => (
              <button key={color.id} className={`product-color-swatch size-[29px] shrink-0 rounded-full ${selectedColorIndex === index ? 'is-selected' : ''}`} type="button" style={{ backgroundColor: color.hex }} onClick={() => { setSelectedColorIndex(index); setActiveImage(0); setGalleryInteracted(true); }} aria-label={`${color.name} color`} aria-pressed={selectedColorIndex === index} title={color.name} />
            ))}
          </div>
        </div>
        <div className="product-thumbnails mt-3 overflow-x-auto pb-1" aria-label="Choose product image">
          <div className="flex w-max min-w-full justify-center gap-3">
            {gallery.map((frame, index) => (
              <button key={`${frame.label}-${index}`} className={`product-thumbnail relative size-20 shrink-0 overflow-hidden rounded-[18px] p-[2px] ${activeImage === index ? 'is-selected' : ''}`} type="button" onClick={() => chooseImage(index)} aria-label={`Show ${frame.label.toLowerCase()}`} aria-pressed={activeImage === index}>
                <span className="block h-full w-full overflow-hidden rounded-[15px]"><img className="h-full w-full object-cover" src={frame.src} alt="" style={{ objectPosition: frame.position, transform: `scale(${frame.scale})` }} loading="lazy" /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <h1 className="mt-6 mb-3 text-[29px] leading-[1.08] font-semibold tracking-[-0.03em] text-white">{product.name}</h1>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <Link className="text-[14px] text-white/65 underline decoration-white/30 underline-offset-4" to={`/shop?category=${product.categoryId}`}>{category}</Link>
        <div className="flex items-baseline gap-2.5">
          <span className="text-[22px] font-semibold text-white">{formatPrice(selectedVariant.price.amountPaise)}</span>
          {selectedVariant.compareAtPrice && <del className="text-[14px] text-white/45" aria-label={`MRP ${formatPrice(selectedVariant.compareAtPrice.amountPaise)}`}>{formatPrice(selectedVariant.compareAtPrice.amountPaise)}</del>}
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-medium text-white/70">Size</span>
              <button className="grid size-6 place-items-center rounded-full text-nasi-orchid-300" type="button" onClick={() => setDetailsOpen(true)} aria-label="Open size chart" aria-haspopup="dialog" aria-expanded={detailsOpen}><Info size={17} strokeWidth={1.8} aria-hidden="true" /></button>
            </div>
          </div>
          <div className="product-sizes flex gap-1.5 overflow-x-auto pb-0.5" role="group" aria-label="Choose size">{sizeOptions()}</div>
        </div>
        <div className="pb-0.5">{quantityControl()}</div>
      </div>

      <div className="product-dotted-divider mt-7" aria-hidden="true" />
      <section className="mt-6" aria-labelledby="product-about-heading">
        <h2 id="product-about-heading" className="m-0 text-[23px] font-medium leading-tight">More about {product.name}</h2>
        <p className="mt-3 mb-0 text-[14px] leading-relaxed text-white/70">{product.description}</p>
        <dl className="mt-5 space-y-3 text-[13px]">
          <div className="flex gap-3"><dt className="w-[76px] shrink-0 font-semibold text-white">Material</dt><dd className="m-0 leading-relaxed text-white/70">{care.material}</dd></div>
          <div className="flex gap-3"><dt className="w-[76px] shrink-0 font-semibold text-white">Wash</dt><dd className="m-0 leading-relaxed text-white/70">{care.washing}</dd></div>
          <div className="flex gap-3"><dt className="w-[76px] shrink-0 font-semibold text-white">Iron</dt><dd className="m-0 leading-relaxed text-white/70">{care.ironing}</dd></div>
        </dl>
        <p className="mt-4 mb-0 text-[11px] text-white/45">For exact care instructions, follow the label on your item.</p>
      </section>

      {similar.length ? <MerchRow title={`Similar to ${product.name}`} products={similar} {...merchActions} /> : (
        <section className="mt-9" aria-label={`Similar to ${product.name}`}><h2 className="mb-3 text-[23px] font-medium">Similar to {product.name}</h2><p className="text-[13px] text-white/55">More {category.toLowerCase()} are coming soon.</p></section>
      )}
      <MerchRow title="Trending" products={trending} {...merchActions} />

      <ChatFAQ items={faqItems} />

      <AnimatePresence>
        {shareStatus && <motion.div className="product-share-toast fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-full px-4 py-2 text-[13px] font-medium text-white" role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}>{shareStatus}</motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {detailsOpen && (
          <motion.div className="product-overlay fixed inset-0 z-[100] flex items-end justify-center bg-black/65" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} onClick={(event) => { if (event.target === event.currentTarget) setDetailsOpen(false); }}>
            <motion.div ref={dialogRef} className="product-info-sheet flex max-h-[85dvh] w-full max-w-[480px] flex-col overflow-y-auto rounded-t-[30px] px-5 pb-[calc(24px+env(safe-area-inset-bottom))] text-white" role="dialog" aria-modal="true" aria-labelledby="size-chart-heading" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: reducedMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-white/30" aria-hidden="true" />
              <div className="mt-5 flex items-start justify-between gap-3">
                <div><p className="m-0 text-[12px] font-semibold tracking-[0.12em] text-white/70 uppercase">Nasi Fashion House</p><h2 id="size-chart-heading" className="m-0 mt-1 text-[25px] leading-tight font-semibold">Size chart</h2></div>
                <button ref={closeRef} className="product-image-action grid size-9 shrink-0 place-items-center rounded-full" type="button" onClick={() => setDetailsOpen(false)} aria-label="Close size chart"><X size={18} aria-hidden="true" /></button>
              </div>
              <p className="mt-2 mb-0 text-[14px] text-white/70">{product.name}</p>
              <h3 className="mt-7 mb-3 text-[17px] font-semibold">Choose your size</h3>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Choose size in size chart">{sizeOptions()}</div>
              <div className="mt-6 overflow-hidden rounded-[18px] border border-white/15">
                {colorVariants.map((variant) => <div key={variant.id} className={`flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-[13px] last:border-b-0 ${selectedVariant.id === variant.id ? 'bg-white/10' : ''}`}><span className="font-semibold">{variant.size || 'One size'}</span><span className="text-white/70">{sizeNames[variant.size] || 'Single size'}</span></div>)}
              </div>
              <p className="mt-3 mb-0 text-[12px] leading-relaxed text-white/60">This is a general size label guide. Exact garment measurements can vary by style.</p>
              <div className="mt-7 flex items-center justify-between gap-3 border-t border-white/15 pt-5">
                <div className="flex flex-col"><span className="text-[21px] font-semibold">{formatPrice(selectedVariant.price.amountPaise)}</span>{selectedVariant.compareAtPrice && <del className="text-[13px] text-white/45">{formatPrice(selectedVariant.compareAtPrice.amountPaise)}</del>}</div>
                {quantityControl()}
              </div>
            </motion.div>
          </motion.div>
        )}
        {expanded && (
          <motion.div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4" ref={dialogRef} role="dialog" aria-modal="true" aria-label={`Expanded ${product.name} image`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} onClick={(event) => { if (event.target === event.currentTarget) setExpanded(false); }}>
            <button ref={closeRef} className="product-image-action absolute right-5 top-5 grid size-11 place-items-center rounded-full" type="button" onClick={() => setExpanded(false)} aria-label="Close expanded image"><X size={20} aria-hidden="true" /></button>
            <img className="max-h-full max-w-full rounded-[18px] object-contain" src={gallery[activeImage].src} alt={gallery[activeImage].alt} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function MobileProductPage(props) {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug && item.published);
  if (!product) return <main className="mobile-page mx-auto min-h-screen max-w-[480px] pt-[120px] text-center"><h1 className="text-[25px] font-semibold">This piece is unavailable</h1><Link className="mt-4 inline-block text-nasi-orchid-300 underline" to="/shop">Back to the shop</Link></main>;
  return <ProductDetails key={product.id} product={product} {...props} />;
}
