import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { legalPages, storeContact } from '../../data/legalPages';
import InstagramIcon from '../ui/InstagramIcon';

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

            <nav className="footer-link-group footer-legal" aria-label="Legal pages">
              <h3>Legal pages</h3>
              {legalPages.map((page) => <Link key={page.slug} to={`/${page.slug}`}>{page.title}</Link>)}
            </nav>

            <div className="footer-link-group footer-contact">
              <h3>Contact us</h3>
              <a href={storeContact.mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open map for ${storeContact.address}`}><MapPin size={17} aria-hidden="true" /><span>{storeContact.address}</span></a>
              <a href={storeContact.phoneHref}><Phone size={17} aria-hidden="true" /><span>{storeContact.phoneDisplay}</span></a>
              <a href={storeContact.emailHref}><Mail size={17} aria-hidden="true" /><span>{storeContact.email}</span></a>
              <a href={storeContact.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Nasi Fashion House on Instagram, ${storeContact.instagramHandle}`}><InstagramIcon size={17} /><span>{storeContact.instagramHandle}</span></a>
            </div>

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
