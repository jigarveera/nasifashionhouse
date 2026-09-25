import { articles, categories, products } from '../../data/catalog';

// Fixture adapter. Replace these methods with server calls when endpoints are available.
export const storefrontApi = {
  async getHome() { return { featured: products.filter((p) => p.isFeatured).slice(0, 4) }; },
  async getCategories() { return categories; },
  async getProducts(query = {}) {
    let items = products.filter((p) => p.published);
    if (query.onSale) items = items.filter((p) => p.variants.some((v) => v.compareAtPrice?.amountPaise > v.price.amountPaise));
    if (query.categoryId && query.categoryId !== 'all') items = items.filter((p) => p.categoryId === query.categoryId);
    if (query.q) {
      const term = query.q.trim().toLocaleLowerCase();
      items = items.filter((p) => [p.name, p.description, ...p.tags].join(' ').toLocaleLowerCase().includes(term));
    }
    if (query.size) items = items.filter((p) => p.variants.some((v) => v.size === query.size && v.available));
    if (query.sort === 'price-asc') items.sort((a, b) => a.variants[0].price.amountPaise - b.variants[0].price.amountPaise);
    if (query.sort === 'price-desc') items.sort((a, b) => b.variants[0].price.amountPaise - a.variants[0].price.amountPaise);
    if (query.sort === 'newest') items.reverse();
    const page = Math.max(1, Number(query.page) || 1);
    return { items: items.slice(0, page * 8), total: items.length, hasMore: page * 8 < items.length };
  },
  async getProduct(slug) { return products.find((p) => p.slug === slug && p.published) || null; },
  async getRelated(productId) {
    const product = products.find((p) => p.id === productId);
    return (product?.relatedProductIds || []).map((id) => products.find((p) => p.id === id)).filter(Boolean);
  },
  async getCartRecommendations(lines) {
    const inCart = new Set(lines.map((line) => line.productId));
    const ids = [...new Set(lines.flatMap((line) => products.find((p) => p.id === line.productId)?.relatedProductIds || []))];
    return ids.map((id) => products.find((p) => p.id === id)).filter((p) => p && !inCart.has(p.id) && p.variants.some((v) => v.available)).slice(0, 3);
  },
  async getArticles() { return { items: articles, total: articles.length }; },
  async getArticle(slug) { return articles.find((article) => article.slug === slug) || null; },
  async subscribe() { throw new Error('Newsletter signup is not connected yet.'); },
};

export const getProductById = (id) => products.find((p) => p.id === id);
export const getVariant = (productId, variantId) => getProductById(productId)?.variants.find((v) => v.id === variantId);
export const getCategoryName = (id) => categories.find((category) => category.id === id)?.name || 'Collection';
