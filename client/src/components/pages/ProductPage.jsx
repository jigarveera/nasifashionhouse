import { useState } from 'react';
import { ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useStore } from '../../app/useStore';
import { getCategoryName } from '../../features/catalog/api';
import { products } from '../../data/catalog';
import MerchCard from '../ui/MerchCard';
import Price from '../ui/Price';
import QuantityStepper from '../ui/QuantityStepper';

export default function ProductPage() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  const [imageIndex, setImageIndex] = useState(0);
  const [variantId, setVariantId] = useState('');
  const [prompt, setPrompt] = useState('');
  const { likes, toggleLike, quantityFor, changeQuantity } = useStore();
  if (!product) return <div className="section container catalog-empty"><h1>We could not find that piece.</h1><Link to="/shop" className="button button-dark">Explore the collection</Link></div>;
  const available = product.variants.filter((variant) => variant.available);
  const selected = product.variants.find((variant) => variant.id === variantId) || (available.length === 1 ? available[0] : null);
  const quantity = selected ? quantityFor(selected.id) : 0;
  const related = product.relatedProductIds.map((id) => products.find((item) => item.id === id)).filter(Boolean);
  function add() { if (!selected) { setPrompt('Choose a size to add this piece.'); return; } changeQuantity(product.id, selected.id, 1); setPrompt(''); }
  function changeImage(delta) { setImageIndex((index) => (index + delta + product.images.length) % product.images.length); }
  return <>
    <section className="product-page container pb-16"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/shop">Shop</Link><span>/</span><Link to={`/shop?category=${product.categoryId}`}>{getCategoryName(product.categoryId)}</Link><span>/</span><span>{product.name}</span></nav>
      <div className="product-top"><div className="product-gallery"><div className="product-main-image"><img src={product.images[imageIndex]?.url || '/product-placeholder.svg'} alt={product.images[imageIndex]?.alt || product.name} /><div className="gallery-arrows"><button type="button" onClick={() => changeImage(-1)} aria-label="Previous image"><ArrowLeft size={19} /></button><button type="button" onClick={() => changeImage(1)} aria-label="Next image"><ArrowRight size={19} /></button></div></div><div className="product-thumbs">{product.images.map((image, index) => <button key={index} type="button" onClick={() => setImageIndex(index)} aria-label={`Show image ${index + 1}`} aria-pressed={imageIndex === index} className={imageIndex === index ? 'active' : ''}><img src={image.url} alt="" /></button>)}</div></div>
      <div className="product-details"><span className="eyebrow">{getCategoryName(product.categoryId)}</span><h1>{product.name}</h1><Price variant={selected || product.variants[0]} className="product-price" /><p className="product-description">{product.description}</p><div className="detail-divider" /><div className="product-choice"><div><strong>Color</strong><span>{selected?.color || product.variants[0]?.color}</span></div><div className="color-dot" aria-hidden="true" /></div>{available.length > 1 && <div className="product-sizes"><div><strong>Select size</strong><span>Sample availability</span></div><div className="size-options">{product.variants.map((variant) => <button key={variant.id} type="button" disabled={!variant.available} className={selected?.id === variant.id ? 'active' : ''} aria-pressed={selected?.id === variant.id} onClick={() => { setVariantId(variant.id); setPrompt(''); }}>{variant.size}</button>)}</div></div>}<p className="stock-note">{selected ? 'Available in the preview catalog' : 'Choose a size to continue'}</p>{prompt && <p className="field-error" role="alert">{prompt}</p>}<div className="product-actions">{quantity > 0 ? <QuantityStepper quantity={quantity} max={selected.stock} onDecrease={() => changeQuantity(product.id, selected.id, -1)} onIncrease={() => changeQuantity(product.id, selected.id, 1)} label={`${product.name} quantity`} /> : <button type="button" className="button button-dark" onClick={add}>Add to bag <ArrowRight size={18} /></button>}<button type="button" className={`product-like ${likes.includes(product.id) ? 'is-liked' : ''}`} aria-label={`${likes.includes(product.id) ? 'Remove from' : 'Add to'} likemarks`} aria-pressed={likes.includes(product.id)} onClick={() => toggleLike(product.id)}><Heart size={20} fill={likes.includes(product.id) ? 'currentColor' : 'none'} /></button></div><p className="product-caveat">Product and availability details shown are sample content. Delivery terms will appear when checkout is connected.</p><div className="product-detail-notes"><details><summary>Details</summary><p>{product.description}</p></details><details><summary>Care</summary><p>Care instructions will be provided with verified product information.</p></details></div></div></div>
    </section>
    {related.length > 0 && <section className="section container"><div className="section-heading"><div><span className="eyebrow">COMPLETE THE LOOK</span><h2>Pair it <em>with.</em></h2></div></div><div className="merch-grid related-grid">{related.map((item) => <MerchCard product={item} key={item.id} />)}</div></section>}
    <section className="product-story"><div className="container"><span className="eyebrow">MORE TO DISCOVER</span><h2>Make it <em>your own.</em></h2><p>Explore the collection for pieces that fit your point of view.</p><Link to="/shop" className="button button-light">Shop the collection <ArrowRight size={18} /></Link></div></section>
  </>;
}
