import { useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavigationBar from './components/ui/NavigationBar';
import MobileHomePage from './components/pages/MobileHomePage';
import MobileShopPage from './components/pages/MobileShopPage';
import MobileProductPage from './components/pages/MobileProductPage';
import Footer from './components/sections/Footer';

export default function App() {
  const [bagQuantities, setBagQuantities] = useState(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem('nfh-bag-quantities') || '{}');
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    } catch {
      return {};
    }
  });
  const [favorites, setFavorites] = useState({});
  const [shopSearch, setShopSearch] = useState('');
  const [shopSearchDocked, setShopSearchDocked] = useState(false);
  const shopSearchMainRef = useRef(null);
  const shopSearchDockRef = useRef(null);

  useEffect(() => {
    if (shopSearchDocked && document.activeElement === shopSearchMainRef.current) {
      shopSearchDockRef.current?.focus({ preventScroll: true });
    } else if (!shopSearchDocked && document.activeElement === shopSearchDockRef.current) {
      shopSearchMainRef.current?.focus({ preventScroll: true });
    }
  }, [shopSearchDocked]);

  useEffect(() => {
    try {
      window.localStorage.setItem('nfh-bag-quantities', JSON.stringify(bagQuantities));
    } catch {
      // The bag still works for this visit when storage is unavailable.
    }
  }, [bagQuantities]);

  function changeQuantity(productId, amount) {
    setBagQuantities((current) => {
      const next = { ...current };
      const quantity = Math.max(0, Math.min(99, (Number(next[productId]) || 0) + amount));
      if (quantity) next[productId] = quantity;
      else delete next[productId];
      return next;
    });
  }

  function toggleFavorite(productId) {
    setFavorites((current) => ({ ...current, [productId]: !current[productId] }));
  }

  const merchandiseActions = { bagQuantities, changeQuantity, favorites, toggleFavorite };

  return (
    <div className="app-shell">
      <NavigationBar shopSearch={shopSearch} setShopSearch={setShopSearch} shopSearchDocked={shopSearchDocked} shopSearchMainRef={shopSearchMainRef} shopSearchDockRef={shopSearchDockRef} />
      <Routes>
        <Route path="/" element={<MobileHomePage {...merchandiseActions} />} />
        <Route path="/shop" element={<MobileShopPage {...merchandiseActions} search={shopSearch} setSearch={setShopSearch} searchDocked={shopSearchDocked} setSearchDocked={setShopSearchDocked} searchMainRef={shopSearchMainRef} />} />
        <Route path="/product/:slug" element={<MobileProductPage {...merchandiseActions} />} />
        <Route path="*" element={<MobileHomePage {...merchandiseActions} />} />
      </Routes>
      <Footer />
    </div>
  );
}
