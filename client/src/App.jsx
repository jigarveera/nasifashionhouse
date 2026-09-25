import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import StoreProvider from './app/StoreProvider';
import PublicLayout from './app/PublicLayout';

const HomePage = lazy(() => import('./components/pages/HomePage'));
const ShopPage = lazy(() => import('./components/pages/ShopPage'));
const SalePage = lazy(() => import('./components/pages/SalePage'));
const BlogPage = lazy(() => import('./components/pages/BlogPage'));
const ArticlePage = lazy(() => import('./components/pages/ArticlePage'));
const ProductPage = lazy(() => import('./components/pages/ProductPage'));
const LoginPage = lazy(() => import('./components/pages/LoginPage'));
const SignupPage = lazy(() => import('./components/pages/SignupPage'));
const PaymentPage = lazy(() => import('./components/pages/PaymentPage'));
const PageNotFound = lazy(() => import('./components/pages/PageNotFound'));

export default function App() {
  const location = useLocation();
  return <StoreProvider><Suspense fallback={<div className="page-loader" role="status">Finding your next favorite…</div>}><Routes location={location}>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/sale" element={<SalePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<ArticlePage />} />
      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/checkout/payment" element={<PaymentPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  </Routes></Suspense></StoreProvider>;
}
