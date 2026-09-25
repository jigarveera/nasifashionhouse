import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../app/useStore';
import { getCategoryName } from '../../features/catalog/api';
import { isSaleVariant } from '../../lib/money';
import Price from './Price';
import QuantityStepper from './QuantityStepper';

export default function MerchCard({ product }) {
  const [choosing, setChoosing] = useState(false);
  const [chosenId, setChosenId] = useState('');
  const { likes, toggleLike, quantityFor, changeQuantity } = useStore();
  const available = product.variants.filter((variant) => variant.available);
  const chosen = product.variants.find((variant) => variant.id === chosenId);
  const selected = chosen || (available.length === 1 ? available[0] : null);
  const quantity = selected ? quantityFor(selected.id) : 0;

  function add() {
    if (!selected) { setChoosing(true); return; }
    changeQuantity(product.id, selected.id, 1);
    setChoosing(false);
  }

  return <article className="merch-card group min-w-0">
    <div className="merch-image-wrap relative aspect-[4/5] overflow-hidden rounded-[18px] bg-nasi-blackberry-100">
      <Link to={`/product/${product.slug}`} className="merch-image-link" aria-label={`View ${product.name}`}>
        <img src={product.images[0]?.url || '/product-placeholder.svg'} alt={product.images[0]?.alt || `${product.name} image unavailable`} loading="lazy" onError={(event) => { if (!event.currentTarget.src.endsWith('product-placeholder.svg')) event.currentTarget.src = '/product-placeholder.svg'; }} />
      </Link>
      {isSaleVariant(product.variants[0]) && <span className="sale-pill">Sale</span>}
      <button className={`like-button ${likes.includes(product.id) ? 'is-liked' : ''}`} type="button" aria-label={`${likes.includes(product.id) ? 'Remove' : 'Add'} ${product.name} ${likes.includes(product.id) ? 'from' : 'to'} likemarks`} aria-pressed={likes.includes(product.id)} onClick={() => toggleLike(product.id)}><Heart size={19} fill={likes.includes(product.id) ? 'currentColor' : 'none'} /></button>
    </div>
    <div className="merch-info">
      <span className="eyebrow small">{getCategoryName(product.categoryId)}</span>
      <Link to={`/product/${product.slug}`} className="merch-name">{product.name}</Link>
      <Price variant={product.variants[0]} />
      {choosing && <div className="card-options" aria-label={`Choose size for ${product.name}`}>
        {available.map((variant) => <button key={variant.id} className={chosenId === variant.id ? 'selected' : ''} type="button" onClick={() => setChosenId(variant.id)} aria-pressed={chosenId === variant.id}>{variant.size || variant.color}</button>)}
      </div>}
      {quantity > 0 ? <QuantityStepper quantity={quantity} max={selected.stock} onDecrease={() => changeQuantity(product.id, selected.id, -1)} onIncrease={() => changeQuantity(product.id, selected.id, 1)} label={`${product.name} quantity`} /> : <button type="button" className="card-cart-action" disabled={!available.length} onClick={add}>{!available.length ? 'Sold out' : choosing && !selected ? 'Select a size' : 'Add to bag'} <span aria-hidden="true">↗</span></button>}
    </div>
  </article>;
}
