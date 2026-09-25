import { X, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../app/useStore';
import { getProductById, getVariant, storefrontApi } from '../../features/catalog/api';
import { formatMoney } from '../../lib/money';
import Price from '../ui/Price';
import QuantityStepper from '../ui/QuantityStepper';
import { useEffect, useState } from 'react';

export default function CartDrawer({ onClose }) {
  const { lines, count, subtotalPaise, changeQuantity, removeLine } = useStore();
  const [recommended, setRecommended] = useState([]);
  useEffect(() => { let active = true; storefrontApi.getCartRecommendations(lines).then((items) => { if (active) setRecommended(items); }); return () => { active = false; }; }, [lines]);
  return <div className="cart-drawer">
    <div className="cart-sheet-handle" aria-hidden="true"><span /></div>
    <div className="drawer-header"><div><span className="eyebrow small">YOUR SELECTION</span><h2 id="cart-title">Shopping bag <span>({count})</span></h2></div><button data-dialog-close type="button" className="icon-button" onClick={onClose} aria-label="Close shopping bag"><X size={23} /></button></div>
    <div className="cart-body">
      <aside className="cart-recommendations"><span className="eyebrow small">THE FINISHING TOUCH</span><h3>Pair it with</h3>{recommended.length ? recommended.map((product) => <Link className="recommendation" to={`/product/${product.slug}`} onClick={onClose} key={product.id}><img src={product.images[0]?.url || '/product-placeholder.svg'} alt={product.images[0]?.alt || product.name} /><span><strong>{product.name}</strong><Price variant={product.variants[0]} /><small>Choose options →</small></span></Link>) : <p className="small-note">Explore the collection for more pieces to love.</p>}<Link className="text-link" to="/shop" onClick={onClose}>Explore all pieces <ArrowRight size={16} /></Link></aside>
      <div className="cart-items">{lines.length ? lines.map((line) => {
        const product = getProductById(line.productId); const variant = getVariant(line.productId, line.variantId);
        if (!product || !variant) return null;
        return <article className="cart-line" key={line.variantId}><Link to={`/product/${product.slug}`} onClick={onClose}><img src={product.images[0]?.url || '/product-placeholder.svg'} alt={product.images[0]?.alt || product.name} /></Link><div><span className="eyebrow small">{product.categoryId.replaceAll('-', ' ')}</span><Link className="cart-line-name" to={`/product/${product.slug}`} onClick={onClose}>{product.name}</Link><p>{[variant.color, variant.size].filter(Boolean).join(' · ')}</p><Price variant={variant} /><div className="cart-line-controls"><QuantityStepper quantity={line.quantity} max={variant.stock} onDecrease={() => changeQuantity(product.id, variant.id, -1)} onIncrease={() => changeQuantity(product.id, variant.id, 1)} label={`${product.name} quantity`} /><button type="button" className="remove-button" onClick={() => removeLine(variant.id)} aria-label={`Remove ${product.name}`}><Trash2 size={17} /></button></div></div></article>;
      }) : <div className="cart-empty"><span className="empty-icon">✳</span><h3>Your bag is waiting.</h3><p>Discover a piece you will reach for again and again.</p><Link className="button button-dark" to="/shop" onClick={onClose}>Explore the collection <ArrowRight size={17} /></Link></div>}</div>
    </div>
    <div className="cart-summary"><div><span>Subtotal</span><strong>{formatMoney({ amountPaise: subtotalPaise })}</strong></div><p>Delivery and any applicable charges are calculated when checkout is available.</p><Link className={`button button-dark full ${!lines.length ? 'disabled' : ''}`} to={lines.length ? '/checkout/payment' : '#'} onClick={lines.length ? onClose : (event) => event.preventDefault()} aria-disabled={!lines.length}>Continue to checkout <ArrowRight size={18} /></Link></div>
  </div>;
}
