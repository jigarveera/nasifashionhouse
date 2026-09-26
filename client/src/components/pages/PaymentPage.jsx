import { ArrowLeft, ArrowRight, CreditCard, LockKeyhole, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../data/catalog';

const money = (paise) => `₹${(paise / 100).toLocaleString('en-IN')}`;

export default function PaymentPage({ bagLines, address, onOpenCart }) {
  const lines = products.flatMap((product) => product.variants.filter((variant) => Number(bagLines[variant.id]) > 0).map((variant) => ({ product, variant, quantity: bagLines[variant.id] })));
  const subtotalPaise = lines.reduce((total, line) => total + line.variant.price.amountPaise * line.quantity, 0);

  return <main className="mobile-page checkout-page mx-auto min-h-screen max-w-[480px] pt-[106px]" aria-labelledby="checkout-title">
    <Link className="checkout-back" to="/shop"><ArrowLeft size={17} aria-hidden="true" /> Back to shop</Link>
    <p className="checkout-eyebrow">CHECKOUT / PAYMENT</p>
    <h1 id="checkout-title">Review before payment.</h1>
    {!lines.length ? <section className="checkout-card"><h2>Your bag is empty</h2><p>Add a piece before continuing to payment.</p><Link className="shopping-primary" to="/shop">Explore the collection <ArrowRight size={18} /></Link></section> : <>
      <section className="checkout-card"><div className="checkout-card-head"><h2>Delivery</h2><MapPin size={19} aria-hidden="true" /></div>{address ? <p><strong>{address.recipient}</strong><br />{address.room}, {address.building}, {address.street}, {address.locality}<br />{address.city}, {address.state} {address.pincode}<br />{address.phone}</p> : <><p>Add and select a delivery address in your bag to continue.</p><button className="checkout-inline-action" type="button" onClick={onOpenCart}>Open bag to add address <ArrowRight size={16} /></button></>}</section>
      <section className="checkout-card"><div className="checkout-card-head"><h2>Order summary</h2><span>{lines.length} {lines.length === 1 ? 'style' : 'styles'}</span></div>{lines.map(({ product, variant, quantity }) => <div className="checkout-line" key={variant.id}><span>{product.name} <small>{variant.size ? `· ${variant.size} ` : ''}× {quantity}</small></span><strong>{money(variant.price.amountPaise * quantity)}</strong></div>)}<div className="checkout-total"><span>Subtotal</span><strong>{money(subtotalPaise)}</strong></div><p className="checkout-disclosure">Delivery and any applicable taxes will be confirmed by the checkout service.</p></section>
      <section className="checkout-card checkout-payment"><div className="checkout-card-head"><h2>Secure payment</h2><LockKeyhole size={19} aria-hidden="true" /></div><p>Razorpay will open here after the server creates a checkout order and validates your bag. Payment is not connected yet.</p><button className="shopping-primary" type="button" disabled><CreditCard size={18} aria-hidden="true" /> Pay with Razorpay</button><small>No payment or order has been created.</small></section>
    </>}
  </main>;
}
