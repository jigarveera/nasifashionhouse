// Display copy for the local catalog fixtures. Replace with SKU-specific care data when available.
const categoryCare = {
  shirts: { material: 'Soft woven fabric', washing: 'Use a cold gentle wash and dry in shade.', ironing: 'Iron inside out on a low setting.' },
  't-shirts': { material: 'Cotton jersey', washing: 'Machine wash cold with similar colors.', ironing: 'Iron inside out on a medium setting.' },
  sarees: { material: 'Soft woven fabric', washing: 'Dry clean to protect the drape.', ironing: 'Use low steam through a pressing cloth.' },
  gowns: { material: 'Smooth occasion fabric', washing: 'Dry clean to preserve the finish.', ironing: 'Use low steam on the reverse.' },
  'office-wear': { material: 'Tailored woven fabric', washing: 'Use a cold gentle wash or dry clean.', ironing: 'Iron inside out on a low setting.' },
  pants: { material: 'Soft woven fabric', washing: 'Machine wash cold inside out.', ironing: 'Iron inside out on a medium setting.' },
  dresses: { material: 'Lightweight woven fabric', washing: 'Wash cold on a gentle cycle.', ironing: 'Use low heat on the reverse.' },
  'co-ords': { material: 'Lightweight woven fabric', washing: 'Wash cold on a gentle cycle.', ironing: 'Use low heat on the reverse.' },
  kurtas: { material: 'Soft woven fabric', washing: 'Hand wash cold and dry in shade.', ironing: 'Iron inside out on a low setting.' },
  jackets: { material: 'Structured woven fabric', washing: 'Dry clean to help hold the shape.', ironing: 'Use low steam on the reverse.' },
  accessories: { material: 'See the item label for composition', washing: 'Wipe clean with a soft, slightly damp cloth.', ironing: 'Do not iron.' },
};

const productMaterial = {
  'linen-daylight-shirt': 'See the item label for composition',
  'studio-black-blouse': 'See the item label for composition',
  'weekend-cotton-shirt': 'See the item label for composition',
  'afterglow-satin-gown': 'Satin-finish fabric',
  'relaxed-blue-denim': 'Denim',
  'studio-cotton-tee': 'Cotton jersey',
};

export function getProductCare(product) {
  const care = categoryCare[product.categoryId] || categoryCare.shirts;
  return { ...care, material: productMaterial[product.id] || care.material };
}
