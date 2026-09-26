import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, products } from '../src/data/catalog.js';
import { legalPages } from '../src/data/legalPages.js';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const dist = join(projectRoot, 'dist');
const baseHtml = await readFile(join(dist, 'index.html'), 'utf8');
const siteName = 'Nasi Fashion House';
const originInput = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'http://localhost:4173';
const origin = new URL(originInput.includes('://') ? originInput : `https://${originInput}`).origin;
const absolute = (path) => new URL(path, origin).href;
const publishedProducts = products.filter((product) => product.published);

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function imagePath(url) {
  if (url?.startsWith('/')) return url;
  const photoId = url?.match(/photo-[a-zA-Z0-9-]+/)?.[0];
  return photoId ? `/images/${photoId}.jpg` : url;
}

function fallbackProductLinks(items) {
  return `<ul>${items.map((product) => `<li><a href="/product/${encodeURIComponent(product.slug)}">${escapeHtml(product.name)}</a></li>`).join('')}</ul>`;
}

function renderHtml({ title, description, keywords, path, image, imageAlt, fallback, structuredData, indexable = true }) {
  const imageUrl = image ? absolute(imagePath(image)) : null;
  const canonical = absolute(path);
  const tags = [
    `<meta name="robots" content="${indexable ? 'index, follow, max-image-preview:large' : 'noindex, nofollow'}" />`,
  ];

  if (indexable) {
    tags.push(
      `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="${siteName}" />`,
      `<meta property="og:locale" content="en_IN" />`,
      `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
      `<meta property="og:title" content="${escapeHtml(title)}" />`,
      `<meta property="og:description" content="${escapeHtml(description)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    );
    if (imageUrl) {
      tags.push(
        `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
        `<meta property="og:image:type" content="image/jpeg" />`,
        `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
        `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
        `<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`,
      );
      if (imageUrl.startsWith('https://')) tags.push(`<meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />`);
    }
    if (structuredData) {
      tags.push(`<script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`);
    }
  }

  return baseHtml
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<meta name="keywords"[^>]*>/i, `<meta name="keywords" content="${escapeHtml(keywords)}" />`)
    .replace('</head>', `  ${tags.join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
}

async function writePage(relativePath, html) {
  const output = join(dist, relativePath);
  await mkdir(join(output, '..'), { recursive: true });
  await writeFile(output, html);
}

const homeDescription = "Discover women's shirts, dresses, sarees, co-ord sets and everyday fashion at Nasi Fashion House. Style without compromise.";
const legalFallbackLinks = `<h2>Legal pages</h2><ul>${legalPages.map((page) => `<li><a href="/${page.slug}">${escapeHtml(page.title)}</a></li>`).join('')}</ul>`;
const homeFallback = `<main class="seo-fallback"><h1>Style Without Compromise</h1><p>${escapeHtml(homeDescription)}</p><p><a href="/shop">Explore the collection</a></p><h2>Featured pieces</h2>${fallbackProductLinks(publishedProducts.filter((product) => product.isFeatured))}${legalFallbackLinks}</main>`;
await writePage('index.html', renderHtml({
  title: 'Nasi Fashion House | Style Without Compromise',
  description: homeDescription,
  keywords: "Nasi Fashion House, women's fashion, women's clothing, shirts, dresses, sarees, co-ord sets, Indian fashion",
  path: '/',
  image: '/images/photo-1496747611176-843222e1e57c.jpg',
  imageAlt: 'Fashion look from Nasi Fashion House',
  fallback: homeFallback,
  structuredData: [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: siteName, url: absolute('/'), description: homeDescription },
    { '@context': 'https://schema.org', '@type': 'Organization', name: siteName, url: absolute('/'), logo: absolute('/brand/NFH-logo.png') },
  ],
}));

await writePage('shop.html', renderHtml({
  title: "Shop Women's Fashion | Nasi Fashion House",
  description: 'Explore shirts, dresses, sarees, co-ord sets, trousers and more at Nasi Fashion House. Find pieces for work, weekends and occasions.',
  keywords: "shop women's fashion, women's shirts, dresses, sarees, co-ord sets, trousers, Nasi Fashion House",
  path: '/shop',
  image: '/images/photo-1539109136881-3be0616acf4b.jpg',
  imageAlt: 'Contemporary fashion look from the Nasi Fashion House collection',
  fallback: `<main class="seo-fallback"><h1>Shop Nasi Fashion House</h1><p>Explore our collection of contemporary womenswear.</p>${fallbackProductLinks(publishedProducts)}</main>`,
  structuredData: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: "Shop Women's Fashion", url: absolute('/shop'), isPartOf: { '@type': 'WebSite', name: siteName, url: absolute('/') } },
}));

for (const product of publishedProducts) {
  const category = categories.find((item) => item.id === product.categoryId)?.name || product.categoryId;
  const path = `/product/${encodeURIComponent(product.slug)}`;
  const firstImage = imagePath(product.images[0]?.url || '/product-placeholder.svg');
  const price = Math.min(...product.variants.map((variant) => variant.price.amountPaise)) / 100;
  const available = product.variants.some((variant) => variant.available && variant.stock > 0);
  const description = `${product.description} Shop ${product.name} at Nasi Fashion House for ₹${price.toLocaleString('en-IN')}.`;
  const fallback = `<main class="seo-fallback"><a href="/shop">Shop</a><p>${escapeHtml(category)}</p><h1>${escapeHtml(product.name)}</h1><img src="${escapeHtml(firstImage)}" alt="${escapeHtml(product.images[0]?.alt || product.name)}" /><p>${escapeHtml(description)}</p><p>₹${escapeHtml(price.toLocaleString('en-IN'))}</p><a href="/shop">Explore more pieces</a></main>`;
  await writePage(`product/${product.slug}.html`, renderHtml({
    title: `${product.name} | Nasi Fashion House`,
    description,
    keywords: `${product.name}, ${category}, women's fashion, Nasi Fashion House`,
    path,
    image: firstImage,
    imageAlt: product.images[0]?.alt || product.name,
    fallback,
    structuredData: [
      {
        '@context': 'https://schema.org', '@type': 'Product', name: product.name,
        description: product.description, sku: product.id, category,
        image: product.colorways.flatMap((colorway) => colorway.images.map((item) => absolute(imagePath(item.url)))),
        brand: { '@type': 'Brand', name: siteName },
        offers: { '@type': 'Offer', url: absolute(path), priceCurrency: 'INR', price, availability: `https://schema.org/${available ? 'InStock' : 'OutOfStock'}` },
      },
      {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absolute('/') },
          { '@type': 'ListItem', position: 2, name: 'Shop', item: absolute('/shop') },
          { '@type': 'ListItem', position: 3, name: product.name, item: absolute(path) },
        ],
      },
    ],
  }));
}

for (const page of legalPages) {
  const path = `/${page.slug}`;
  const sections = page.sections.map((section) => `<section><h2>${escapeHtml(section.heading)}</h2>${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`).join('');
  await writePage(`${page.slug}.html`, renderHtml({
    title: `${page.title} | Nasi Fashion House`,
    description: page.description,
    keywords: `${page.title}, Nasi Fashion House, customer support`,
    path,
    image: '/images/photo-1496747611176-843222e1e57c.jpg',
    imageAlt: 'Nasi Fashion House fashion look',
    fallback: `<main class="seo-fallback"><a href="/">Home</a><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.intro)}</p><p>Last updated ${escapeHtml(page.updated)}</p>${sections}</main>`,
    structuredData: { '@context': 'https://schema.org', '@type': 'WebPage', name: page.title, description: page.description, url: absolute(path), isPartOf: { '@type': 'WebSite', name: siteName, url: absolute('/') } },
  }));
}

for (const [path, title] of [['/checkout/payment', 'Payment'], ['/order-confirmation', 'Order confirmation']]) {
  await writePage(`${path.slice(1)}.html`, renderHtml({
    title: `${title} | Nasi Fashion House`, description: `${title} at Nasi Fashion House.`, keywords: '',
    path, fallback: `<main class="seo-fallback"><h1>${escapeHtml(title)}</h1></main>`, indexable: false,
  }));
}

const sitemapPaths = ['/', '/shop', ...publishedProducts.map((product) => `/product/${encodeURIComponent(product.slug)}`), ...legalPages.map((page) => `/${page.slug}`)];
await writeFile(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map((path) => `  <url><loc>${escapeHtml(absolute(path))}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${absolute('/sitemap.xml')}\n`);
await writeFile(join(dist, 'llms.txt'), `# ${siteName}\n\n${homeDescription}\n\n## Browse\n- [Home](${absolute('/')})\n- [Shop all products](${absolute('/shop')})\n\n## Products\n${publishedProducts.map((product) => `- [${product.name}](${absolute(`/product/${encodeURIComponent(product.slug)}`)}): ${product.description}`).join('\n')}\n\n## Policies\n${legalPages.map((page) => `- [${page.title}](${absolute(`/${page.slug}`)}): ${page.description}`).join('\n')}\n`);

console.log(`Generated SEO pages for ${publishedProducts.length} products using ${origin}`);
