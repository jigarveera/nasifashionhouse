import { useEffect, useRef, useState } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 'first',
    eyebrow: 'The new edit',
    title: 'A dress for every day.',
    href: '/shop?category=dresses',
    image: '/images/photo-1496747611176-843222e1e57c.jpg',
    imagePosition: '65% center',
    flipImage: true,
  },
  {
    id: 'second',
    eyebrow: 'Modern classics',
    title: 'Layers made to last.',
    href: '/shop?category=jackets',
    image: '/images/photo-1485968579580-b6d095142e6e.jpg',
    imagePosition: 'center 32%',
    flipImage: true,
  },
  {
    id: 'third',
    eyebrow: 'A little occasion',
    title: 'The festive edit.',
    href: '/shop?category=festive-wear',
    image: '/images/photo-1610030469983-98e550d6193c.jpg',
    imagePosition: 'center 27%',
  },
  {
    id: 'fourth',
    eyebrow: 'Made to move',
    title: 'A fresh take on sets.',
    href: '/shop?category=co-ords',
    image: '/images/photo-1539109136881-3be0616acf4b.jpg',
    imagePosition: 'center 36%',
  },
  {
    id: 'fifth',
    eyebrow: 'Everyday favorites',
    title: 'Denim, your way.',
    href: '/shop?category=pants',
    image: '/images/photo-1598554747436-c9293d6a588f.jpg',
    imagePosition: 'center 50%',
  },
];

function animateToSlide(viewport, index, reducedMotion, animationRef) {
  if (!viewport) return;
  animationRef.current?.stop();
  const target = index * viewport.clientWidth;
  if (reducedMotion) {
    viewport.scrollLeft = target;
    return null;
  }
  animationRef.current = animate(viewport.scrollLeft, target, {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1],
    onUpdate: (value) => { viewport.scrollLeft = value; },
  });
  return animationRef.current;
}

export default function PromoCarousel() {
  const viewportRef = useRef(null);
  const animationRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  function goToSlide(index) {
    animateToSlide(viewportRef.current, index, reducedMotion, animationRef);
    setActiveIndex(index);
  }

  useEffect(() => {
    if (reducedMotion) return undefined;
    let autoplayAnimation;
    const interval = window.setInterval(() => {
      const viewport = viewportRef.current;
      if (!viewport || document.visibilityState !== 'visible') return;
      const current = Math.round(viewport.scrollLeft / viewport.clientWidth);
      autoplayAnimation = animateToSlide(viewport, (current + 1) % slides.length, false, animationRef);
    }, 5000);
    return () => {
      window.clearInterval(interval);
      autoplayAnimation?.stop();
    };
  }, [reducedMotion]);

  function handleScroll(event) {
    const viewport = event.currentTarget;
    const next = Math.round(viewport.scrollLeft / viewport.clientWidth);
    setActiveIndex(Math.min(Math.max(next, 0), slides.length - 1));
  }

  return (
    <section className="promo-carousel relative" aria-label="Featured collections" aria-roledescription="carousel">
      <div ref={viewportRef} className="promo-track flex overflow-x-auto rounded-[28px]" onScroll={handleScroll} onPointerDown={() => animationRef.current?.stop()}>
        {slides.map((slide, index) => (
          <div className="promo-slide relative min-w-full shrink-0 overflow-hidden rounded-[28px]" key={slide.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`}>
            <img className="absolute inset-0 h-full w-full object-cover" src={slide.image} alt="" style={{ objectPosition: slide.imagePosition, transform: slide.flipImage ? 'scaleX(-1)' : undefined }} />
            <div className="promo-shade absolute inset-0" />
            <motion.div
              className="promo-content relative z-10 flex h-full max-w-[62%] flex-col items-start justify-center px-6 pb-9 pt-5"
              initial={false}
              animate={{ opacity: activeIndex === index ? 1 : 0.78, x: activeIndex === index ? 0 : -5 }}
              transition={{ duration: reducedMotion ? 0 : 0.45 }}
            >
              <span className="mb-2 text-xs font-medium text-nasi-plum-900">{slide.eyebrow}</span>
              <h2 className="promo-title m-0 text-[26px] leading-[1.08] font-semibold tracking-[-0.025em] text-nasi-orchid-800">{slide.title}</h2>
              <Link className="promo-cta mt-4 inline-flex min-h-[38px] items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold text-white" to={slide.href}>Explore <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" /></Link>
            </motion.div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-0.5" aria-label="Choose banner slide">
        {slides.map((slide, index) => (
          <button className="grid h-6 w-[18px] place-items-center border-0 bg-transparent p-0" key={slide.id} type="button" onClick={() => goToSlide(index)} aria-label={`Show banner ${index + 1}`} aria-current={activeIndex === index ? 'true' : undefined}>
            <motion.span className="block h-1.5 rounded-full bg-nasi-orchid-700" animate={{ width: activeIndex === index ? 16 : 5, opacity: activeIndex === index ? 1 : 0.35 }} transition={{ duration: reducedMotion ? 0 : 0.3 }} />
          </button>
        ))}
      </div>
    </section>
  );
}
