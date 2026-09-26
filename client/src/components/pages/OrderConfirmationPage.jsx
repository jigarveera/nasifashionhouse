import { ArrowRight, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrderConfirmationPage() {
  return <main className="mobile-page checkout-page mx-auto min-h-screen max-w-[480px] pt-[120px]" aria-labelledby="order-confirmation-title">
    <div className="confirmation-icon"><PackageCheck size={30} strokeWidth={1.5} aria-hidden="true" /></div>
    <p className="checkout-eyebrow">ORDER CONFIRMATION</p>
    <h1 id="order-confirmation-title">No confirmed order yet.</h1>
    <p className="confirmation-copy">Your order will appear here after a payment is verified by the store. Razorpay checkout is not connected in this preview.</p>
    <Link className="shopping-primary" to="/shop">Continue exploring <ArrowRight size={18} aria-hidden="true" /></Link>
  </main>;
}
