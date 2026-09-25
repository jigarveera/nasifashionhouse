import { useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const looks = [
  { src: 'photo-1485968579580-b6d095142e6e', alt: 'Woman in a relaxed layered fashion look' },
  { src: 'photo-1539109136881-3be0616acf4b', alt: 'Woman in a contemporary tailored outfit' },
  { src: 'photo-1496747611176-843222e1e57c', alt: 'Woman wearing a flowing dress outdoors' },
  { src: 'photo-1529139574466-a303027c1d8b', alt: 'Woman in an expressive fashion look' },
  { src: 'photo-1598554747436-c9293d6a588f', alt: 'Woman wearing an everyday outfit' },
];

export default function HeroSection() {
  const galleryRef = useRef(null);

  function moveGallery(direction) {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const card = gallery.querySelector('.hero-photo');
    const step = (card?.getBoundingClientRect().width || 220) + 18;
    gallery.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  return <section id="hero-section" className="hero-section" aria-labelledby="hero-title">
    <div className="hero-inner">
      <div className="hero-copy container">
        <span className="hero-eyebrow"><span aria-hidden="true">✦</span> A fresh point of view <span aria-hidden="true">✦</span></span>
        <h1 id="hero-title">Style without <em>compromise.</em></h1>
        <p>Curated for women who treat fashion as self-expression. Discover understated pieces for everyday elegance.</p>
        <Link to="/shop" className="hero-cta">Shop the collection <span><ArrowUpRight size={17} /></span></Link>
      </div>

      <div className="hero-gallery-stage">
        <button type="button" className="hero-gallery-arrow hero-gallery-prev" onClick={() => moveGallery(-1)} aria-label="Previous fashion looks"><ArrowLeft size={20} /></button>
        <div ref={galleryRef} className="hero-gallery" role="region" aria-label="Collection looks" tabIndex={0}>
          {looks.map((look, index) => <div className={`hero-photo hero-photo-${index + 1}`} key={look.src} role="img" aria-label={look.alt}>
            <img src={`https://images.unsplash.com/${look.src}?auto=format&fit=crop&w=700&q=85`} alt="" fetchPriority={index < 2 ? 'high' : 'auto'} loading={index < 2 ? 'eager' : 'lazy'} onError={(event) => { event.currentTarget.style.display = 'none'; }} />
            {index === 2 && <span className="hero-photo-badge"><span aria-hidden="true">✦</span><strong>The NFH edit</strong><small>Made for your moment</small></span>}
          </div>)}
        </div>
        <button type="button" className="hero-gallery-arrow hero-gallery-next" onClick={() => moveGallery(1)} aria-label="Next fashion looks"><ArrowRight size={20} /></button>
      </div>
    </div>
  </section>;
}
