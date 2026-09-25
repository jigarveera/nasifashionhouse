import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({ quantity, onDecrease, onIncrease, max, label = 'Quantity' }) {
  return <div className="quantity-stepper" aria-label={label}>
    <button type="button" onClick={onDecrease} aria-label={`Decrease ${label.toLowerCase()}`}><Minus size={17} /></button>
    <span aria-live="polite">{quantity}</span>
    <button type="button" onClick={onIncrease} disabled={max != null && quantity >= max} aria-label={`Increase ${label.toLowerCase()}`} title={max != null && quantity >= max ? 'Maximum available quantity' : undefined}><Plus size={17} /></button>
  </div>;
}
