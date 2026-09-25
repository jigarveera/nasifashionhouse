import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../data/catalog';
import HeroSection from '../sections/HeroSection';
import MerchCard from '../ui/MerchCard';
import FAQ from '../sections/FAQ';

const quickLinks = [
  { label: 'Dresses', id: 'dresses', image: 'photo-1496747611176-843222e1e57c' },
  { label: 'Co-ords', id: 'co-ords', image: 'photo-1539109136881-3be0616acf4b' },
  { label: 'Everyday', id: 'shirts', image: 'photo-1598554747436-c9293d6a588f' },
  { label: 'Accessories', id: 'accessories', image: 'photo-1547949003-9792a18a2601' },
];

export default function HomePage() {
  return <>
    <HeroSection />
    <section className="section container" aria-labelledby="category-title"><div className="section-heading"><div><span className="eyebrow">CURATED FOR YOU</span><h2 id="category-title">Find your <em>moment.</em></h2></div><Link className="text-link" to="/shop">Explore all <ArrowRight size={17} /></Link></div><div className="category-grid grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-[17px]">{quickLinks.map((item) => <Link className="category-tile relative overflow-hidden" key={item.id} to={`/shop?category=${item.id}`}><img loading="lazy" src={`https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=700&q=85`} alt="" /><span>{item.label}<ArrowUpRight size={20} /></span></Link>)}</div></section>
    <section className="section product-section bg-white" aria-labelledby="new-title"><div className="container"><div className="section-heading"><div><span className="eyebrow">THE PIECES WE LOVE</span><h2 id="new-title">New &amp; <em>noted.</em></h2><p>Thoughtful shapes for wherever your day takes you.</p></div><Link className="text-link" to="/shop">Shop all pieces <ArrowRight size={17} /></Link></div><div className="merch-grid grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-6 xl:grid-cols-4">{products.filter((p) => p.isFeatured).map((product) => <MerchCard key={product.id} product={product} />)}</div></div></section>
    <section className="campaign-section"><div className="container campaign-inner"><div><span className="eyebrow light">A DIFFERENT KIND OF EVERYDAY</span><h2>Wear what moves <em>you.</em></h2><p>Easy silhouettes. Expressive details. A wardrobe that feels entirely your own.</p><Link to="/shop" className="button button-light">Discover the edit <ArrowUpRight size={18} /></Link></div><div className="campaign-image"><img loading="lazy" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85" alt="Woman exploring a fashion collection" /></div></div></section>
    <section className="section container story-section"><div className="story-image"><img loading="lazy" src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85" alt="Contemporary layered fashion look" /><span className="image-chip">THE NFH POINT OF VIEW</span></div><div className="story-copy"><span className="eyebrow">OUR STORY</span><h2>Everyday elegance, <em>your way.</em></h2><p>We believe style is personal. The best pieces feel as natural on an ordinary Tuesday as they do when the day takes an unexpected turn.</p><p>Explore silhouettes that make room for you.</p><Link className="text-link" to="/blog">Read the journal <ArrowRight size={18} /></Link></div></section>
    <section className="section container" aria-labelledby="sale-title"><div className="section-heading"><div><span className="eyebrow">A LITTLE SOMETHING EXTRA</span><h2 id="sale-title">The sale <em>edit.</em></h2></div><Link className="text-link" to="/sale">Explore sale <ArrowRight size={17} /></Link></div><div className="merch-grid">{products.filter((p) => p.variants.some((v) => v.compareAtPrice)).slice(0, 4).map((product) => <MerchCard key={product.id} product={product} />)}</div></section>
    <FAQ />
  </>;
}
