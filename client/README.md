# Nasi Fashion House storefront

React 19 + Vite storefront written in JavaScript and JSX. Styling uses Tailwind CSS v4 with the NFH palette in [`src/tailwind.config.js`](src/tailwind.config.js). React components use Tailwind utilities; shared semantic styles use `@apply` in [`src/index.css`](src/index.css), alongside the detailed effects and responsive rules.

## Run locally

```bash
npm install
npm run dev
```

Check the production build and lint rules with `npm run build` and `npm run lint`.

## Search and sharing on Vercel

The production build generates static HTML for the home, shop, each published product URL, and the legal pages. Each page includes its own canonical URL, description, Open Graph and X card tags, and structured data. The same build writes `sitemap.xml`, `robots.txt`, and a readable `llms.txt` into `dist`. Vercel serves these files directly and sends other app routes to the React router.

Set `SITE_URL` to the public HTTPS origin (for example, `https://your-domain.example`) in Vercel when using a custom domain. If it is unset, the build uses Vercel's production URL system variable, then its deployment URL. Local builds use `http://localhost:4173`. Rebuild after changing the public domain or catalog so canonical links, social previews, and the sitemap stay current.

## Current data and integrations

The catalog and journal are explicit preview fixtures in [`src/data/catalog.js`](src/data/catalog.js), exposed through the adapter in [`src/features/catalog/api.js`](src/features/catalog/api.js). Cart lines and likemarks are local to this browser. Product details, availability, and prices are sample content. Account creation, newsletter signup, and payment do not submit to a service yet.

Remote editorial photos use Unsplash image URLs. Product cards fall back to a local placeholder if an image fails to load. Replace fixture media and copy with licensed store assets and live catalog responses before launch.

The legal pages in [`src/data/legalPages.js`](src/data/legalPages.js) describe the current preview. Add the merchant's confirmed return window, refund timing, cancellation cutoff, and delivery terms before activating checkout.
