import { formatMoney, isSaleVariant } from '../../lib/money';

export default function Price({ variant, className = '' }) {
  if (!variant) return null;
  return <span className={`price ${className}`}>
    <strong>{formatMoney(variant.price)}</strong>
    {isSaleVariant(variant) && <del>{formatMoney(variant.compareAtPrice)}</del>}
  </span>;
}
