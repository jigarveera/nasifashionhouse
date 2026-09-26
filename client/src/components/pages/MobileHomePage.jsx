import { Link } from 'react-router-dom';
import { products } from '../../data/catalog';
import CategoryRail from '../ui/CategoryRail';
import MerchRow from '../ui/MerchRow';
import PromoCarousel from '../ui/PromoCarousel';
import FAQ from '../sections/FAQ';

export default function MobileHomePage({ bagQuantities, changeQuantity, favorites, toggleFavorite }) {
  const merchandiseActions = { bagQuantities, changeQuantity, favorites, toggleFavorite };
  const trending = products.filter((product) => product.published && product.categoryId !== 'accessories');
  const shirts = products.filter((product) => product.categoryId === 'shirts');
  const pants = products.filter((product) => product.categoryId === 'pants');

  return (
    <main className="mobile-page mx-auto min-h-screen max-w-[480px] pb-16 pt-[115px]" aria-label="Home page">
      <div className="mb-6">
        <p className="mb-2 text-[13px] font-medium tracking-[0.16em] text-surface-100 uppercase">Nasi Fashion House</p>
        <h1 className="hero-gradient-title m-0 whitespace-nowrap text-[clamp(24px,7.7vw,37px)] leading-[1.05] font-semibold tracking-[-0.035em]">Style Without Compromise</h1>
      </div>

      <PromoCarousel />

      <section className="mt-8" aria-labelledby="category-heading">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="category-heading" className="m-0 text-[23px] leading-none font-medium text-white">Category</h2>
          <Link className="text-[14px] text-white/55" to="/shop">See All</Link>
        </div>
        <CategoryRail navigation />
      </section>

      <MerchRow title="Trending collection" products={trending} {...merchandiseActions} />
      <MerchRow title="Shirts & Blouses" products={shirts} {...merchandiseActions} />
      <MerchRow title="Pants & Denim" products={pants} {...merchandiseActions} />
      <FAQ />
    </main>
  );
}
