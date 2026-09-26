import MobileMerchCard from './MobileMerchCard';

export default function MerchRow({ title, products, bagQuantities, changeQuantity, favorites, toggleFavorite }) {
  if (!products.length) return null;

  const headingId = `merch-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <section className="mt-9" aria-labelledby={headingId}>
      <h2 id={headingId} className="mb-4 text-[23px] leading-tight font-medium text-white">{title}</h2>
      <div className="merch-rail flex gap-3 overflow-x-auto pb-2" aria-label={`${title} products`}>
        {products.map((product) => (
          <MobileMerchCard
            key={product.id}
            className="w-[190px] shrink-0 md:w-[230px] xl:w-[250px]"
            product={product}
            quantity={bagQuantities[product.id] || 0}
            favorite={Boolean(favorites[product.id])}
            onQuantityChange={changeQuantity}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}
