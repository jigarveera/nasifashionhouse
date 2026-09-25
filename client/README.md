# Nasi Fashion House storefront

React 19 + Vite storefront written in JavaScript and JSX. Styling uses Tailwind CSS v4 with the NFH palette in [`src/tailwind.config.js`](src/tailwind.config.js). React components use Tailwind utilities; shared semantic styles use `@apply` in [`src/index.css`](src/index.css), alongside the detailed effects and responsive rules.

## Run locally

```bash
npm install
npm run dev
```

Check the production build and lint rules with `npm run build` and `npm run lint`.

## Current data and integrations

The catalog and journal are explicit preview fixtures in [`src/data/catalog.js`](src/data/catalog.js), exposed through the adapter in [`src/features/catalog/api.js`](src/features/catalog/api.js). Cart lines and likemarks are local to this browser. Product details, availability, and prices are sample content. Account creation, newsletter signup, and payment do not submit to a service yet.

Remote editorial photos use Unsplash image URLs. Product cards fall back to a local placeholder if an image fails to load. Replace fixture media and copy with licensed store assets and live catalog responses before launch.
