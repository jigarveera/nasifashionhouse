import { useId } from 'react';
import { Heart, Minus, Plus, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

function productImage(product) {
  const image = product.images[0];
  const photoId = image.url.match(/photo-[^?]+/)?.[0];
  return photoId ? `/images/${photoId}.jpg` : image.url;
}

export default function MobileMerchCard({ product, quantity = 0, favorite = false, onQuantityChange, onToggleFavorite, className = '' }) {
  const heartGradientId = `heart-gradient-${useId().replace(/[^a-z0-9]/gi, '')}`;
  const price = product.variants[0].price.amountPaise / 100;
  const mrp = Math.round(price * 1.4);
  const swatches = product.colorways;

  return (
    <article className={`mobile-merch-card min-w-0 rounded-[25px] p-[5px] ${className}`}>
      <div className="relative aspect-[0.82] rounded-[21px] bg-[#303030]">
        <Link className="block h-full w-full" to={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          <img className="h-full w-full rounded-[21px] object-cover" src={productImage(product)} alt={product.images[0].alt} loading="lazy" />
        </Link>
        <div className="color-palette absolute left-2.5 top-2.5 flex items-center -space-x-1 rounded-full p-1.5" role="img" aria-label={`Available colors: ${swatches.map((color) => color.name).join(', ')}`}>
          {swatches.map((color) => <span key={color.id} className="size-[15px] rounded-full border border-white/80" style={{ backgroundColor: color.hex }} />)}
        </div>
        <button className={`favorite-button absolute right-2.5 top-2.5 grid size-9 place-items-center rounded-full text-white ${favorite ? 'border-0' : 'border border-white/40'}`} type="button" onClick={() => onToggleFavorite(product.id)} aria-label={favorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`} aria-pressed={favorite}>
          <Heart size={21} strokeWidth={1.7} stroke={favorite ? `url(#${heartGradientId})` : 'currentColor'} fill={favorite ? `url(#${heartGradientId})` : 'none'} aria-hidden="true">
            <defs>
              <linearGradient id={heartGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dfa9f0" />
                <stop offset="100%" stopColor="#bb58d8" />
              </linearGradient>
            </defs>
          </Heart>
          {favorite && <span className="heart-burst" aria-hidden="true">{[0, 1, 2, 3].map((index) => <span key={index}>♥</span>)}</span>}
        </button>
      </div>

      <div className="px-2 pb-2 pt-3">
        <div className="flex items-center justify-between gap-1">
          <h3 className="m-0 min-w-0 truncate text-[15px] font-semibold leading-tight text-white"><Link to={`/product/${product.slug}`}>{product.name}</Link></h3>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-[12px] text-white/85" aria-label="Sample rating 4.9 out of 5"><Star size={14} strokeWidth={1.6} aria-hidden="true" /> 4.9</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-1.5">
          <div className="merch-price-group inline-flex items-baseline gap-1.5 whitespace-nowrap">
            <p className="m-0 text-[20px] leading-none font-medium tracking-[-0.025em] text-white">₹{price.toLocaleString('en-IN')}</p>
            <del className="merch-card-mrp hidden text-[12px] text-white/45" aria-label={`MRP ₹${mrp.toLocaleString('en-IN')}`}>₹{mrp.toLocaleString('en-IN')}</del>
          </div>
          {quantity ? (
            <div className="merch-quantity inline-flex h-[36px] min-w-[82px] items-center justify-center gap-[1.265625px] rounded-full font-semibold text-white" role="group" aria-label={`${product.name} quantity`}>
              <button className="grid size-8 place-items-center rounded-full" type="button" onClick={() => onQuantityChange(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus className="translate-x-[3.625px]" size={15} aria-hidden="true" /></button>
              <span className="min-w-3 text-center text-[13px] font-semibold" aria-live="polite">{quantity}</span>
              <button className="grid size-8 place-items-center rounded-full" type="button" onClick={() => onQuantityChange(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus className="-translate-x-[3.625px]" size={15} aria-hidden="true" /></button>
            </div>
          ) : (
            <button className="merch-add inline-flex h-[36px] shrink-0 items-center gap-[7.5px] rounded-full px-3 text-[11px] font-semibold tracking-[0.04em] text-white uppercase" type="button" onClick={() => onQuantityChange(product.id, 1)} aria-label={`Add ${product.name} to bag`}>
              Add <ShoppingBag size={15} strokeWidth={1.8} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
