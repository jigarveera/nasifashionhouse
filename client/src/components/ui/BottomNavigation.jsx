import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { Heart, House, Search, ShoppingBag } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { label: 'Home', icon: House },
  { label: 'Wishlist', icon: Heart },
  { label: 'Cart', icon: ShoppingBag },
];

export default function BottomNavigation({ activePanel, onOpenPanel, onClosePanel, cartCount, wishlistCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const railRef = useRef(null);
  const suppressClickRef = useRef(false);
  const indicatorOffset = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const searchActive = location.pathname === '/shop';
  const activeIndex = activePanel === 'wishlist' ? 1 : activePanel === 'cart' ? 2 : location.pathname === '/' ? 0 : -1;

  useEffect(() => {
    let lastY = window.scrollY;
    let direction = 0;
    let distance = 0;

    function handleScroll() {
      const currentY = window.scrollY;
      const change = currentY - lastY;
      lastY = currentY;

      if (currentY <= 40) {
        distance = 0;
        setIsVisible(true);
        return;
      }
      if (Math.abs(change) < 1) return;

      const nextDirection = Math.sign(change);
      distance = nextDirection === direction ? distance + Math.abs(change) : Math.abs(change);
      direction = nextDirection;

      if (direction > 0 && currentY > 120 && distance >= 22) setIsVisible(false);
      if (direction < 0 && distance >= 10) setIsVisible(true);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function moveIndicator(offset) {
    if (activeIndex < 0 || !railRef.current) return;
    const railWidth = railRef.current.clientWidth;
    const tabWidth = (railWidth - 8) / 3;
    const start = 4 + activeIndex * tabWidth;
    const minimum = 4 - start;
    const maximum = railWidth - 4 - tabWidth - start;
    indicatorOffset.set(Math.max(minimum, Math.min(maximum, offset)));
  }

  function selectTab(index, fromDrag = false) {
    if (suppressClickRef.current && !fromDrag) return;
    if (index === 0) {
      onClosePanel();
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else onOpenPanel(index === 1 ? 'wishlist' : 'cart');
  }

  function handleIndicatorDrop(_, info) {
    setIsDragging(false);
    animate(indicatorOffset, 0, { type: 'spring', stiffness: 310, damping: 19 });
    if (Math.abs(info.offset.x) < 12 || activeIndex < 0) return;
    const bounds = railRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const index = Math.max(0, Math.min(2, Math.floor((info.point.x - bounds.left) / (bounds.width / 3))));
    suppressClickRef.current = true;
    selectTab(index, true);
    window.setTimeout(() => { suppressClickRef.current = false; }, 220);
  }

  return (
    <motion.nav className="bottom-nav fixed inset-x-0 z-[70] mx-auto flex w-full max-w-[480px] items-center gap-3 px-5" aria-label="Bottom navigation" inert={!isVisible} initial={false} animate={{ y: isVisible ? 0 : 160, opacity: isVisible ? 1 : 0 }} transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 32 }}>
      <motion.div ref={railRef} className="bottom-nav-rail relative grid min-w-0 flex-1 grid-cols-3 p-1" style={{ touchAction: 'pan-y' }} onPanStart={() => { if (activeIndex >= 0) setIsDragging(true); }} onPan={(_, info) => moveIndicator(info.offset.x)} onPanEnd={handleIndicatorDrop}>
        <motion.div
          className="bottom-nav-indicator absolute inset-y-1 z-[1] rounded-full"
          style={{ width: 'calc((100% - 8px) / 3)', x: indicatorOffset }}
          animate={{ left: ['4px', 'calc(33.333% + 1.333px)', 'calc(66.666% - 1.333px)'][Math.max(0, activeIndex)], opacity: activeIndex < 0 ? 0 : 1, scaleX: isDragging && !reducedMotion ? 1.09 : 1, scaleY: isDragging && !reducedMotion ? .93 : 1 }}
          transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 20 }}
          aria-hidden="true"
        />
        {tabs.map(({ label, icon: Icon }, index) => (
          <button key={label} type="button" className={`bottom-nav-tab relative z-[2] flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-full ${activeIndex === index ? 'is-active' : ''}`} onClick={() => selectTab(index)} aria-label={label} aria-current={activeIndex === index ? 'page' : undefined} aria-haspopup={index ? 'dialog' : undefined} aria-expanded={index ? activePanel === (index === 1 ? 'wishlist' : 'cart') : undefined}>
            <span className="relative"><Icon size={20} strokeWidth={activeIndex === index ? 2 : 1.7} aria-hidden="true" />{index === 1 && wishlistCount > 0 && <span className="bottom-nav-badge" aria-label={`${wishlistCount} saved pieces`}>{wishlistCount}</span>}{index === 2 && cartCount > 0 && <span className="bottom-nav-badge" aria-label={`${cartCount} items in bag`}>{cartCount}</span>}</span>
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </button>
        ))}
      </motion.div>
      <button type="button" className={`bottom-nav-search grid size-[62px] shrink-0 place-items-center rounded-full ${searchActive && !activePanel ? 'is-active' : ''}`} onClick={() => { onClosePanel(); navigate('/shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Search the collection" aria-current={searchActive && !activePanel ? 'page' : undefined}>
        <Search size={23} strokeWidth={1.8} aria-hidden="true" />
      </button>
    </motion.nav>
  );
}
