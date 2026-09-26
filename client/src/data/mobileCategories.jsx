import {
  BriefcaseBusiness,
  Flower2,
  Gem,
  LayoutGrid,
  Layers3,
  Scissors,
  Shirt,
  Sparkles,
  SwatchBook,
  Waves,
} from 'lucide-react';

export const mobileCategories = [
  { id: 'all', name: 'All', description: 'Explore every style', icon: LayoutGrid },
  { id: 'co-ords', name: 'Co-ord Sets', description: 'Tailored sets, relaxed sets, ethnic co-ords', icon: Layers3 },
  { id: 'kurtas', name: 'Kurta Sets', description: 'Embroidered sets, short kurtas, kurta-and-pant sets', icon: Shirt },
  { id: 'sarees', name: 'Sarees', description: 'Contemporary drapes, handloom, festive sarees', icon: Waves },
  { id: 'dresses', name: 'Dresses', description: 'Midi, maxi, shirt and occasion dresses', icon: Sparkles },
  { id: 'office-wear', name: 'Office Wear', description: 'Blazers, tailored trousers, waistcoats', icon: BriefcaseBusiness },
  { id: 'shirts', name: 'Shirts & Blouses', description: 'Crisp shirts, relaxed linen, statement blouses', icon: Shirt },
  { id: 'pants', name: 'Pants & Denim', description: 'Wide-leg trousers, relaxed jeans, palazzos', icon: Scissors },
  { id: 'fusion-wear', name: 'Fusion Wear', description: 'Short kurtas with trousers, tailored Indian separates', icon: SwatchBook },
  { id: 'festive-wear', name: 'Festive Wear', description: 'Dressy kurta sets, lehengas, sharara sets', icon: Flower2 },
  { id: 'skirts', name: 'Skirts', description: 'Midi and maxi skirts', icon: Waves },
  { id: 'gowns', name: 'Gowns & Evening Wear', description: 'Draped gowns and occasion pieces', icon: Gem },
  { id: 'jackets', name: 'Jackets & Layers', description: 'Light jackets, structured layers', icon: Layers3 },
];

export const relatedCategoryIds = {
  'fusion-wear': ['co-ords', 'kurtas'],
  'festive-wear': ['sarees', 'kurtas', 'gowns'],
};

export function toggleCategorySelection(current, id) {
  if (id === 'all') return ['all'];
  const selected = current.filter((category) => category !== 'all');
  const next = selected.includes(id) ? selected.filter((category) => category !== id) : [...selected, id];
  return next.length ? next : ['all'];
}

export function productMatchesCategories(product, selected) {
  if (selected.includes('all')) return true;
  return selected.some((id) => (relatedCategoryIds[id] || [id]).includes(product.categoryId));
}
