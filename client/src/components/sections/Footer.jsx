import { ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const exploreLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop all', to: '/shop' },
  { label: 'Co-ord sets', to: '/shop?category=co-ords' },
  { label: 'Office wear', to: '/shop?category=office-wear' },
];

const categoryLinks = [
  { label: 'Shirts & blouses', to: '/shop?category=shirts' },
  { label: 'Pants & denim', to: '/shop?category=pants' },
  { label: 'Dresses', to: '/shop?category=dresses' },
  { label: 'Sarees', to: '/shop?category=sarees' },
];

export default function Footer() {
  return (
    <footer className="site-footer" aria-label="Nasi Fashion House footer">
      <div className="footer-artwork" role="img" aria-label="Illustration of four women in Nasi Fashion House looks" />

      <div className="footer-content">
        <div className="footer-content-inner">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" aria-label="Nasi Fashion House home"><img src="/brand/NFH-logo.png" alt="Nasi Fashion House" /></Link>
              <p>Style without compromise.</p>
              <span>Pieces for every way you show up.</span>
            </div>

            <nav className="footer-link-group" aria-label="Footer explore links">
              <h3>Explore</h3>
              {exploreLinks.map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}
            </nav>

            <nav className="footer-link-group" aria-label="Footer category links">
              <h3>Categories</h3>
              {categoryLinks.map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}
            </nav>

          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Nasi Fashion House</span>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUp size={16} aria-hidden="true" /> Top</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
