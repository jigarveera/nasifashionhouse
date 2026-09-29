import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';
import NavigationBar from './components/ui/NavigationBar';
import Footer from './components/sections/Footer';
import NewsletterSection from './components/sections/NewsletterSection';
import AuthSheet from './components/ui/AuthSheet';
import BottomNavigation from './components/ui/BottomNavigation';
import ShoppingSheet from './components/ui/ShoppingSheet';
import Loader from './components/ui/Loader';
import { products } from './data/catalog';
import { legalPages } from './data/legalPages';

const MobileHomePage = lazy(() => import('./components/pages/MobileHomePage'));
const MobileShopPage = lazy(() => import('./components/pages/MobileShopPage'));
const MobileProductPage = lazy(() => import('./components/pages/MobileProductPage'));
const PaymentPage = lazy(() => import('./components/pages/PaymentPage'));
const OrderConfirmationPage = lazy(() => import('./components/pages/OrderConfirmationPage'));
const PolicyPage = lazy(() => import('./components/pages/PolicyPage'));
const ComingSoonPage = lazy(() => import('./components/pages/ComingSoon'));

export default function App() {
  const [bagLines, setBagLines] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('nfh-bag-lines-v1') || 'null');
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) return Object.fromEntries(Object.entries(saved).filter(([variantId, quantity]) => products.some((product) => product.variants.some((variant) => variant.id === variantId)) && Number.isInteger(quantity) && quantity > 0 && quantity <= 99));
      const legacy = JSON.parse(window.localStorage.getItem('nfh-bag-quantities') || '{}');
      if (!legacy || typeof legacy !== 'object' || Array.isArray(legacy)) return {};
      return Object.fromEntries(products.flatMap((product) => {
        const quantity = Number(legacy[product.id]);
        const variant = product.variants.find((item) => item.size === 'M' && item.available) || product.variants.find((item) => item.available);
        return variant && Number.isInteger(quantity) && quantity > 0 ? [[variant.id, Math.min(99, quantity)]] : [];
      }));
    } catch {
      return {};
    }
  });
  const bagQuantities = useMemo(() => Object.fromEntries(products.map((product) => [product.id, product.variants.reduce((total, variant) => total + (bagLines[variant.id] || 0), 0)])), [bagLines]);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('nfh-favorites') || '{}');
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    } catch { return {}; }
  });
  const [shopSearch, setShopSearch] = useState('');
  const [shopSearchDocked, setShopSearchDocked] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [shoppingPanel, setShoppingPanel] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const shopSearchMainRef = useRef(null);
  const shopSearchDockRef = useRef(null);
  const closeAuth = useCallback(() => setAuthOpen(false), []);
  const closeShoppingPanel = useCallback(() => setShoppingPanel(null), []);
  const signOutPreview = useCallback(() => {
    setPreviewProfile(null);
    setAuthOpen(false);
  }, []);

  useEffect(() => {
    if (shopSearchDocked && document.activeElement === shopSearchMainRef.current) {
      shopSearchDockRef.current?.focus({ preventScroll: true });
    } else if (!shopSearchDocked && document.activeElement === shopSearchDockRef.current) {
      shopSearchMainRef.current?.focus({ preventScroll: true });
    }
  }, [shopSearchDocked]);

  useEffect(() => {
    try {
      window.localStorage.setItem('nfh-bag-lines-v1', JSON.stringify(bagLines));
    } catch {
      // The bag still works for this visit when storage is unavailable.
    }
  }, [bagLines]);

  useEffect(() => {
    try { window.localStorage.setItem('nfh-favorites', JSON.stringify(favorites)); }
    catch { /* Favorites remain available for this visit. */ }
  }, [favorites]);

  function changeQuantity(productId, amount, variantId) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    setBagLines((current) => {
      const variant = product.variants.find((item) => item.id === variantId && item.available)
        || product.variants.find((item) => current[item.id] > 0)
        || product.variants.find((item) => item.size === 'M' && item.available)
        || product.variants.find((item) => item.available);
      if (!variant) return current;
      const next = { ...current };
      const quantity = Math.max(0, Math.min(variant.stock || 99, (Number(next[variant.id]) || 0) + amount));
      if (quantity) next[variant.id] = quantity;
      else delete next[variant.id];
      return next;
    });
  }

  function toggleFavorite(productId) {
    setFavorites((current) => ({ ...current, [productId]: !current[productId] }));
  }

  function saveAddress(address) {
    const id = address.id || window.crypto?.randomUUID?.() || `address-${Date.now()}`;
    setAddresses((current) => current.some((item) => item.id === id)
      ? current.map((item) => item.id === id ? { ...address, id } : item)
      : [...current, { ...address, id }]);
    setSelectedAddressId(id);
  }

  function openShoppingPanel(panel) {
    setAuthOpen(false);
    setShoppingPanel(panel);
  }

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId);

  const merchandiseActions = { bagQuantities, bagLines, changeQuantity, favorites, toggleFavorite };

  return (
    <div className="app-shell">
      <NavigationBar shopSearch={shopSearch} setShopSearch={setShopSearch} shopSearchDocked={shopSearchDocked} shopSearchDockRef={shopSearchDockRef} authOpen={authOpen} previewProfile={previewProfile} onProfileClick={() => { setShoppingPanel(null); setAuthOpen(true); }} activePanel={shoppingPanel} onOpenPanel={openShoppingPanel} onClosePanel={closeShoppingPanel} cartCount={Object.values(bagLines).reduce((total, quantity) => total + quantity, 0)} wishlistCount={Object.values(favorites).filter(Boolean).length} />
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* <Route path="/" element={<MobileHomePage {...merchandiseActions} search={shopSearch} setSearch={setShopSearch} searchDocked={shopSearchDocked} setSearchDocked={setShopSearchDocked} searchMainRef={shopSearchMainRef} />} />
          <Route path="/shop" element={<MobileShopPage {...merchandiseActions} search={shopSearch} setSearch={setShopSearch} searchDocked={shopSearchDocked} setSearchDocked={setShopSearchDocked} searchMainRef={shopSearchMainRef} />} />
          <Route path="/product/:slug" element={<MobileProductPage {...merchandiseActions} />} />
          <Route path="/checkout/payment" element={<PaymentPage bagLines={bagLines} address={selectedAddress} onOpenCart={() => openShoppingPanel('cart')} />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          {legalPages.map((page) => <Route key={page.slug} path={`/${page.slug}`} element={<PolicyPage page={page} />} />)}
          <Route path="*" element={<MobileHomePage {...merchandiseActions} search={shopSearch} setSearch={setShopSearch} searchDocked={shopSearchDocked} setSearchDocked={setShopSearchDocked} searchMainRef={shopSearchMainRef} />} /> */}

           <Route path='/' element={<ComingSoonPage />} />
        </Routes>
      </Suspense>
      <NewsletterSection />
      <Footer />
      <BottomNavigation activePanel={shoppingPanel} onOpenPanel={openShoppingPanel} onClosePanel={closeShoppingPanel} cartCount={Object.values(bagLines).reduce((total, quantity) => total + quantity, 0)} wishlistCount={Object.values(favorites).filter(Boolean).length} />
      <AnimatePresence>{authOpen && <AuthSheet onClose={closeAuth} onVerified={setPreviewProfile} onSignOut={signOutPreview} previewProfile={previewProfile} />}</AnimatePresence>
      <AnimatePresence>{shoppingPanel && <ShoppingSheet key={shoppingPanel} kind={shoppingPanel} onClose={closeShoppingPanel} bagLines={bagLines} changeQuantity={changeQuantity} favorites={favorites} toggleFavorite={toggleFavorite} addresses={addresses} selectedAddressId={selectedAddressId} onSelectAddress={setSelectedAddressId} onSaveAddress={saveAddress} previewProfile={previewProfile} />}</AnimatePresence>
    </div>
  );
}
