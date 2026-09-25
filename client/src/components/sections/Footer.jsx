import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import NewsletterSection from './NewsletterSection';

export default function Footer() {
  return <footer className="site-footer bg-nasi-blackberry-950 text-nasi-ivory-50">
    <div className="container"><NewsletterSection />
      <div className="footer-grid">
        <div className="footer-brand"><img src="/brand/NFH-logo.svg" alt="Nasi Fashion House" /><p>Style without compromise.</p><span>Curated for women who treat fashion as self-expression.</span></div>
        <div><h3>Explore</h3><Link to="/shop">All pieces</Link><Link to="/sale">Sale</Link><Link to="/blog">Journal</Link></div>
        <div><h3>Account</h3><Link to="/login">Log in</Link><Link to="/signup">Sign up</Link><Link to="/checkout/payment">Checkout preview</Link></div>
        <div><h3>Follow along</h3><p>New pieces, ideas, and style notes.</p><span className="footer-social">Instagram <ArrowUpRight size={14} /></span></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Nasi Fashion House</span><span>Storefront preview · Product details and prices are sample content.</span></div>
    </div>
  </footer>;
}
