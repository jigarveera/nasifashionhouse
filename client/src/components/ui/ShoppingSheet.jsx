import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Heart, MapPin, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../../data/catalog';

const money = (paise) => `₹${(paise / 100).toLocaleString('en-IN')}`;
const localImage = (url) => {
  const photoId = url.match(/photo-[^?]+/)?.[0];
  return photoId ? `/images/${photoId}.jpg` : url;
};
const blankAddress = (name = '') => ({ recipient: name, phone: '', room: '', building: '', street: '', locality: '', city: '', state: '', pincode: '' });
let lastLocationLookup = 0;

function QuantityControl({ product, variant, quantity, onChange }) {
  return <div className="shopping-quantity" role="group" aria-label={`${product.name} quantity`}>
    <button type="button" onClick={() => onChange(product.id, -1, variant.id)} aria-label={`Remove one ${product.name}`}><Minus size={15} aria-hidden="true" /></button>
    <span aria-live="polite">{quantity}</span>
    <button type="button" onClick={() => onChange(product.id, 1, variant.id)} aria-label={`Add one ${product.name}`}><Plus size={15} aria-hidden="true" /></button>
  </div>;
}

function AddressForm({ initial, onSave, onCancel }) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [locationBusy, setLocationBusy] = useState(false);
  const aliveRef = useRef(true);

  useEffect(() => () => { aliveRef.current = false; }, []);

  function field(key, label, options = {}) {
    return <label className="address-label" key={key}>{label}
      <input className="address-input" value={draft[key]} onChange={(event) => { setDraft((current) => ({ ...current, [key]: event.target.value })); setError(''); }} autoComplete={options.autoComplete} inputMode={options.inputMode} maxLength={options.maxLength} placeholder={options.placeholder || ''} />
    </label>;
  }

  function save(event) {
    event.preventDefault();
    const cleaned = Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]));
    if (['recipient', 'phone', 'room', 'building', 'street', 'locality', 'city', 'state', 'pincode'].some((key) => !cleaned[key])) { setError('Complete every address and contact field.'); return; }
    if (!/^\d{6}$/.test(cleaned.pincode)) { setError('Enter a valid six-digit PIN code.'); return; }
    if (!/^\d{10}$/.test(cleaned.phone.replace(/\D/g, ''))) { setError('Enter a valid ten-digit phone number.'); return; }
    onSave({ ...cleaned, phone: cleaned.phone.replace(/\D/g, '') });
  }

  function useLocation() {
    if (!navigator.geolocation) { setLocationStatus('Location is unavailable in this browser. Enter your address manually.'); return; }
    if (Date.now() - lastLocationLookup < 1200) { setLocationStatus('Please wait before trying location again.'); return; }
    setLocationBusy(true);
    setLocationStatus('Waiting for location permission…');
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      lastLocationLookup = Date.now();
      try {
        const params = new URLSearchParams({ format: 'jsonv2', lat: String(coords.latitude), lon: String(coords.longitude), addressdetails: '1', zoom: '18', 'accept-language': 'en' });
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`, { headers: { Accept: 'application/json' }, referrerPolicy: 'origin' });
        if (!response.ok) throw new Error('Location lookup failed');
        const result = await response.json();
        const place = result.address || {};
        if (place.country_code !== 'in') throw new Error('This location is outside India. Please enter your delivery address manually.');
        if (!aliveRef.current) return;
        setDraft((current) => ({
          ...current,
          street: place.road || place.pedestrian || current.street,
          locality: place.suburb || place.neighbourhood || place.quarter || place.city_district || current.locality,
          city: place.city || place.town || place.village || place.municipality || current.city,
          state: place.state || current.state,
          pincode: (place.postcode || '').replace(/\D/g, '').slice(0, 6) || current.pincode,
        }));
        setLocationStatus('Nearby details filled. Check them and enter your exact room and building.');
      } catch (lookupError) {
        if (aliveRef.current) setLocationStatus(lookupError.message.startsWith('This location is outside India') ? lookupError.message : 'Could not fetch nearby details. Enter your address manually.');
      } finally { if (aliveRef.current) setLocationBusy(false); }
    }, (locationError) => {
      if (aliveRef.current) { setLocationStatus(locationError.code === 1 ? 'Location permission was not granted. Enter your address manually.' : 'Could not get your location. Enter your address manually.'); setLocationBusy(false); }
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
  }

  return <form className="address-form" onSubmit={save} noValidate>
    <div className="shopping-subhead"><h3>{initial.id ? 'Edit address' : 'Add delivery address'}</h3><button type="button" onClick={onCancel} aria-label="Cancel address editing"><X size={18} /></button></div>
    <button className="address-location" type="button" onClick={useLocation} disabled={locationBusy}><MapPin size={17} aria-hidden="true" />{locationBusy ? 'Finding your location…' : 'Use my location'}</button>
    <p className="address-location-note">With your permission, your coordinates go to OpenStreetMap to fill nearby details. Please verify everything before saving. <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></p>
    {locationStatus && <p className="address-status" role="status">{locationStatus}</p>}
    <div className="address-grid-two">{field('room', 'Room / flat no.', { placeholder: 'Flat 12B' })}{field('building', 'Building name / no.', { placeholder: 'Orchid House' })}</div>
    {field('street', 'Street / landmark', { autoComplete: 'address-line1', placeholder: 'Street and landmark' })}
    {field('locality', 'Area / locality', { autoComplete: 'address-line2', placeholder: 'Neighbourhood' })}
    <div className="address-grid-two">{field('city', 'City', { autoComplete: 'address-level2' })}{field('state', 'State', { autoComplete: 'address-level1' })}</div>
    {field('pincode', 'PIN code', { autoComplete: 'postal-code', inputMode: 'numeric', maxLength: 6, placeholder: '6-digit PIN' })}
    <div className="address-grid-two">{field('recipient', 'Recipient name', { autoComplete: 'name' })}{field('phone', 'Phone number', { autoComplete: 'tel', inputMode: 'tel', maxLength: 15 })}</div>
    {error && <p className="address-error" role="alert">{error}</p>}
    <button className="shopping-primary" type="submit">Save address <ArrowRight size={17} aria-hidden="true" /></button>
  </form>;
}

export default function ShoppingSheet({ kind, onClose, bagLines, changeQuantity, favorites, toggleFavorite, addresses, selectedAddressId, onSelectAddress, onSaveAddress, previewProfile }) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const addressRef = useRef(null);
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressDraft, setAddressDraft] = useState(blankAddress(previewProfile?.name || ''));
  const isCart = kind === 'cart';
  const cartLines = products.flatMap((product) => product.variants.filter((variant) => Number(bagLines[variant.id]) > 0).map((variant) => ({ product, variant, quantity: bagLines[variant.id] })));
  const savedProducts = products.filter((product) => favorites[product.id]);
  const savedLines = savedProducts.map((product) => {
    const variant = product.variants.find((item) => bagLines[item.id] > 0) || product.variants.find((item) => item.size === 'M' && item.available) || product.variants[0];
    return { product, variant, quantity: bagLines[variant.id] || 0 };
  });
  const shownLines = isCart ? cartLines : savedLines;
  const itemCount = cartLines.reduce((total, line) => total + line.quantity, 0);
  const subtotalPaise = cartLines.reduce((total, line) => total + line.variant.price.amountPaise * line.quantity, 0);
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    function handleKeyDown(event) {
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...(dialogRef.current?.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])') || [])];
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleKeyDown); previousFocus?.focus?.(); };
  }, [onClose]);

  function openAddress(address = null) {
    setAddressDraft(address || blankAddress(previewProfile?.name || ''));
    setEditingAddress(true);
    window.setTimeout(() => addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }

  function proceedToPayment() {
    if (!selectedAddress || !cartLines.length) return;
    onClose();
    navigate('/checkout/payment');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  return <motion.div className="shopping-overlay fixed inset-0 z-[120] flex items-end justify-center bg-black/75" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.section ref={dialogRef} className="shopping-sheet flex w-full max-w-[480px] flex-col overflow-hidden rounded-t-[30px]" role="dialog" aria-modal="true" aria-labelledby="shopping-sheet-title" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: reducedMotion ? 0 : .38, ease: [0.22, 1, 0.36, 1] }}>
      <div className="shopping-handle" aria-hidden="true" />
      <div className="shopping-header"><div><p>{isCart ? 'YOUR SELECTION' : 'SAVED FOR LATER'}</p><h2 id="shopping-sheet-title">{isCart ? 'Shopping bag' : 'Wishlist'} <span>({isCart ? itemCount : savedProducts.length})</span></h2></div><button ref={closeRef} className="shopping-close" type="button" onClick={onClose} aria-label={`Close ${isCart ? 'bag' : 'wishlist'}`}><X size={20} aria-hidden="true" /></button></div>
      <div className="shopping-scroll">
        {shownLines.length ? <div className="shopping-lines">{shownLines.map(({ product, variant, quantity }) => {
          const colorway = product.colorways.find((color) => color.id === variant.colorId) || product.colorways[0];
          const image = colorway.images[0];
          return <article className="shopping-line" key={`${product.id}-${variant.id}`}>
            <Link to={`/product/${product.slug}`} onClick={onClose} className="shopping-line-image"><img src={localImage(image.url)} alt={image.alt} /></Link>
            <div className="shopping-line-info"><Link to={`/product/${product.slug}`} onClick={onClose} className="shopping-line-name">{product.name}</Link><p>Color: {variant.color || 'Original'}{variant.size ? ` · Size: ${variant.size}` : ''}</p><strong>{money(variant.price.amountPaise)}</strong><div className="shopping-line-actions">{quantity ? <QuantityControl product={product} variant={variant} quantity={quantity} onChange={changeQuantity} /> : <button className="shopping-small-add" type="button" onClick={() => changeQuantity(product.id, 1, variant.id)}><ShoppingBag size={14} aria-hidden="true" /> Add to bag</button>}{isCart ? <button className="shopping-remove" type="button" onClick={() => changeQuantity(product.id, -quantity, variant.id)} aria-label={`Remove ${product.name} from bag`}><Trash2 size={17} aria-hidden="true" /></button> : <button className="shopping-remove" type="button" onClick={() => toggleFavorite(product.id)} aria-label={`Remove ${product.name} from wishlist`}><Heart size={18} fill="currentColor" aria-hidden="true" /></button>}</div></div>
          </article>;
        })}</div> : <div className="shopping-empty"><span>{isCart ? <ShoppingBag size={28} strokeWidth={1.4} /> : <Heart size={28} strokeWidth={1.4} />}</span><h3>{isCart ? 'Your bag is waiting.' : 'Nothing saved yet.'}</h3><p>{isCart ? 'Explore the collection and add a piece you love.' : 'Tap the heart on a piece to keep it here.'}</p><Link to="/shop" onClick={onClose}>Explore the collection <ArrowRight size={16} /></Link></div>}

        {isCart && cartLines.length > 0 && <section ref={addressRef} className="shopping-address" aria-labelledby="shopping-address-title"><div className="shopping-section-heading"><h3 id="shopping-address-title">Delivery address</h3>{addresses.length > 0 && !editingAddress && <button type="button" onClick={() => openAddress()}>Add another</button>}</div>
          {editingAddress ? <AddressForm key={addressDraft.id || 'new'} initial={addressDraft} onSave={(address) => { onSaveAddress(address); setEditingAddress(false); }} onCancel={() => setEditingAddress(false)} /> : addresses.length ? <div className="shopping-address-options">{addresses.map((address) => <div className={`shopping-address-option ${selectedAddressId === address.id ? 'is-selected' : ''}`} key={address.id}><button type="button" onClick={() => onSelectAddress(address.id)} aria-label={`Deliver to ${address.building}, ${address.city}`} aria-pressed={selectedAddressId === address.id}><span className="shopping-radio" /><span><strong>{address.recipient}</strong><small>{address.room}, {address.building}, {address.street}, {address.locality}<br />{address.city}, {address.state} {address.pincode} · {address.phone}</small></span></button><button className="shopping-address-edit" type="button" onClick={() => openAddress(address)}>Edit</button></div>)}</div> : <button className="shopping-add-address" type="button" onClick={() => openAddress()}><MapPin size={20} aria-hidden="true" /><span><strong>Add delivery address</strong><small>Required before payment</small></span><Plus size={18} aria-hidden="true" /></button>}
        </section>}
      </div>
      {isCart && <div className="shopping-billing"><div className="shopping-billing-row"><span>Subtotal · {itemCount} {itemCount === 1 ? 'item' : 'items'}</span><strong>{money(subtotalPaise)}</strong></div><div className="shopping-billing-row is-muted"><span>Delivery and taxes</span><span>Calculated at checkout</span></div>{cartLines.length > 0 && !editingAddress && (selectedAddress ? <button className="shopping-primary" type="button" onClick={proceedToPayment}>Continue to payment <ArrowRight size={18} aria-hidden="true" /></button> : <button className="shopping-primary" type="button" onClick={() => openAddress()}>Add delivery address <ArrowRight size={18} aria-hidden="true" /></button>)}</div>}
      {!isCart && <div className="shopping-billing"><Link className="shopping-primary" to="/shop" onClick={onClose}>Explore more pieces <ArrowRight size={18} aria-hidden="true" /></Link></div>}
    </motion.section>
  </motion.div>;
}
