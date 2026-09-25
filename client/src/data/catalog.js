// Explicit design fixtures. Replace through the storefront adapter when catalog APIs exist.
const photo = (id, width = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const money = (rupees) => ({ amountPaise: rupees * 100, currency: 'INR' });
const sizes = ['XS', 'S', 'M', 'L', 'XL'];

export const categories = [
  { id: 'all', name: 'All' }, { id: 'shirts', name: 'Shirts' },
  { id: 't-shirts', name: 'T-shirts' }, { id: 'sarees', name: 'Sarees' },
  { id: 'gowns', name: 'Gowns' }, { id: 'office-wear', name: 'Office Wear' },
  { id: 'pants', name: 'Pants' }, { id: 'dresses', name: 'Dresses' },
  { id: 'co-ords', name: 'Co-ords' }, { id: 'kurtas', name: 'Kurtas' },
  { id: 'jackets', name: 'Jackets' }, { id: 'accessories', name: 'Accessories' },
];

const makeProduct = ({ id, name, categoryId, image, alt, price, compareAt, color, description, tags = [], featured = false, related = [], sizeOptions = sizes }) => ({
  id, slug: id, name, categoryId, description, tags, isFeatured: featured, published: true,
  relatedProductIds: related,
  images: [{ url: photo(image), alt }, { url: photo(image, 1200), alt: `${name} — closer view` }],
  variants: sizeOptions.map((size) => ({
    id: `${id}-${size.toLowerCase().replaceAll(' ', '-')}`, size: sizeOptions.length === 1 ? undefined : size,
    color, available: true, stock: 8, price: money(price),
    ...(compareAt && compareAt > price ? { compareAtPrice: money(compareAt) } : {}),
  })),
});

export const products = [
  makeProduct({ id: 'linen-daylight-shirt', name: 'Daylight Linen Shirt', categoryId: 'shirts', image: 'photo-1598554747436-c9293d6a588f', alt: 'Woman wearing a light relaxed shirt', price: 1890, color: 'Ivory', description: 'An easy, breathable shirt with a relaxed line for everyday dressing.', tags: ['linen', 'everyday'], featured: true, related: ['wide-leg-trouser', 'soft-structure-jacket'] }),
  makeProduct({ id: 'marigold-midi-dress', name: 'Marigold Midi Dress', categoryId: 'dresses', image: 'photo-1496747611176-843222e1e57c', alt: 'Woman in a flowing dress outdoors', price: 3290, color: 'Marigold', description: 'A fluid midi silhouette that moves beautifully from day to evening.', tags: ['midi', 'occasion'], featured: true, related: ['everyday-tote', 'soft-structure-jacket'] }),
  makeProduct({ id: 'city-pleat-coord', name: 'City Pleat Co-ord', categoryId: 'co-ords', image: 'photo-1539109136881-3be0616acf4b', alt: 'Woman in a contemporary coordinated outfit', price: 4190, color: 'Sand', description: 'A composed two-piece look with an effortless drape.', tags: ['set', 'modern'], featured: true, related: ['everyday-tote'] }),
  makeProduct({ id: 'afterglow-satin-gown', name: 'Afterglow Satin Gown', categoryId: 'gowns', image: 'photo-1529139574466-a303027c1d8b', alt: 'Woman wearing an evening outfit', price: 4890, compareAt: 5690, color: 'Rose', description: 'A graceful evening silhouette with a soft, luminous finish.', tags: ['evening', 'occasion'], featured: true, related: ['sculpted-mini-bag'] }),
  makeProduct({ id: 'wide-leg-trouser', name: 'Everyday Wide-leg Trouser', categoryId: 'pants', image: 'photo-1483985988355-763728e1935b', alt: 'Fashion look with relaxed trousers', price: 2290, color: 'Mocha', description: 'Easy tailoring and a relaxed leg made for repeat wear.', tags: ['tailored', 'everyday'], related: ['linen-daylight-shirt', 'soft-structure-jacket'] }),
  makeProduct({ id: 'soft-structure-jacket', name: 'Soft Structure Jacket', categoryId: 'jackets', image: 'photo-1485968579580-b6d095142e6e', alt: 'Woman in a layered jacket look', price: 3790, color: 'Cream', description: 'A lightweight layer with just enough structure.', tags: ['layering', 'tailored'], related: ['wide-leg-trouser', 'linen-daylight-shirt'] }),
  makeProduct({ id: 'rosewood-kurta', name: 'Rosewood Kurta', categoryId: 'kurtas', image: 'photo-1610030469983-98e550d6193c', alt: 'Woman wearing a traditional outfit', price: 2590, compareAt: 3090, color: 'Rosewood', description: 'A relaxed kurta designed for a considered everyday wardrobe.', tags: ['ethnic', 'everyday'], related: ['everyday-tote'] }),
  makeProduct({ id: 'evening-saree', name: 'Evening Drape Saree', categoryId: 'sarees', image: 'photo-1610030469983-98e550d6193c', alt: 'Woman in a draped traditional outfit', price: 5990, color: 'Plum', description: 'A fluid drape for moments that call for a little more.', tags: ['occasion', 'drape'], related: ['sculpted-mini-bag'] }),
  makeProduct({ id: 'studio-cotton-tee', name: 'Studio Cotton Tee', categoryId: 't-shirts', image: 'photo-1503342217505-b0a15ec3261c', alt: 'Woman in a simple casual top', price: 990, color: 'White', description: 'A dependable tee with a clean shape and soft hand feel.', tags: ['cotton', 'everyday'], related: ['wide-leg-trouser'] }),
  makeProduct({ id: 'workday-column-dress', name: 'Workday Column Dress', categoryId: 'office-wear', image: 'photo-1534528741775-53994a69daeb', alt: 'Woman in a refined everyday look', price: 2990, compareAt: 3490, color: 'Blackberry', description: 'A refined shape to make getting dressed feel simple.', tags: ['work', 'tailored'], related: ['soft-structure-jacket'] }),
  makeProduct({ id: 'everyday-tote', name: 'Everyday Tote', categoryId: 'accessories', image: 'photo-1547949003-9792a18a2601', alt: 'Neutral leather handbag', price: 1990, color: 'Tan', description: 'An uncomplicated finishing touch with room for the essentials.', tags: ['bag', 'accessory'], sizeOptions: ['One size'], related: ['linen-daylight-shirt'] }),
  makeProduct({ id: 'sculpted-mini-bag', name: 'Sculpted Mini Bag', categoryId: 'accessories', image: 'photo-1584917865442-de89df76afd3', alt: 'Compact fashion handbag', price: 1690, compareAt: 2090, color: 'Berry', description: 'A compact shape for your most important things.', tags: ['bag', 'accessory'], sizeOptions: ['One size'], related: ['afterglow-satin-gown'] }),
];

export const articles = [
  { slug: 'the-art-of-everyday-dressing', title: 'The art of everyday dressing', category: 'Style notes', excerpt: 'A wardrobe can feel considered without feeling complicated. Start with pieces you want to wear again.', image: photo('photo-1483985988355-763728e1935b', 1200), alt: 'A curated fashion display', body: ['Getting dressed is an everyday ritual. The most useful pieces leave space for your own point of view.', 'Begin with shapes that feel comfortable, then add a color, texture, or detail that makes the outfit yours.', 'A wardrobe built slowly can tell a richer story than one built around a single moment.'] },
  { slug: 'a-note-on-color', title: 'A note on color', category: 'Editorial', excerpt: 'Soft neutrals and expressive color can live in the same closet.', image: photo('photo-1496747611176-843222e1e57c', 1200), alt: 'Woman in warm color outdoors', body: ['Color has a way of changing how an outfit feels. It can be quiet, bold, or somewhere in between.', 'Try one expressive shade alongside pieces you already reach for. Let the balance be your own.'] },
  { slug: 'pieces-that-move-with-you', title: 'Pieces that move with you', category: 'Wardrobe', excerpt: 'Thoughtful silhouettes for whatever the day becomes.', image: photo('photo-1539109136881-3be0616acf4b', 1200), alt: 'Contemporary street style', body: ['The best wardrobe pieces make room for a changing day.', 'Explore ease in cut, softness in fabric, and details that work beyond one setting.'] },
];
