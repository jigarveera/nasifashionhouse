# Nasi Fashion House — Design Direction

**Project:** React + Vite storefront  
**Companion:** [LOGIC.md](./LOGIC.md) defines routes, state, behavior, data, and future integrations.  
**Brand line:** “Style without compromise.”  
**Brand description:** “Curated for women who treat fashion as self-expression. Discover understated luxury designed for everyday elegance.”

## 1. Design intent

Design a women's fashion storefront with editorial photography, clean product information, and restrained liquid glass interfaces. The store should feel expressive and elegant in everyday use. The merchandise is the focus; glass, motion, and accent color support it.

Build a reusable design system rather than reproducing any reference screen. The supplied images are visual direction, not production assets or a template to copy. Use licensed or original fashion photography and server images when available. Do not invent price guarantees, review counts, delivery promises, or certifications.

### Visual reference map

| Supplied image | Direction to take | Adaptation for NFH |
| --- | --- | --- |
| `17b1522d-a2bd-4e58-a93d-947a75925b5a.png` | Compact pill navigation, editorial headline, capsule-like fashion portraits, concise campaign CTA | Use the **same shared navbar component** in the hero and site header; ivory canvas, blackberry type, orchid accent, varied but balanced product photography |
| `3e078d62-40f5-46bc-abb3-d0691ffe0f55.png` | Two-column cart: recommendations on the left and cart items on the right | Make this an L2 overlay on landscape tablets and desktop; responsive full-cover cart on mobile and portrait tablets |
| `baf5a0e4-3586-49ff-8386-f8a908254b0c.png` | Small, uncluttered merchandise tile | Use a common MerchCard with image, product name, price, sale state, likes, and an add/quantity control |
| `cba96a104e5c17201aafff9a5ca1cfbf.webp` | Large product gallery, compact buying details, “pair with”, editorial material/story sections, recommendations, reviews, FAQ, newsletter footer | Give the product page clear shopping information first; use the longer storytelling sections below the fold |
| `c9b3274e-b836-427e-858b-3abf099613eb.png` | Account navigation in a left sidebar and content on the right | Use a wide profile L2 overlay with profile, orders, and likemarks; adapt sidebar to top tabs for narrow viewports |

### Outside inspiration

- [Dribbble: Fashion Commerce App with Glassmorphism UI](https://dribbble.com/shots/27560270-Fashion-Commerce-App-with-Glassmorphism-UI): inspiration for a tactile mobile shopping flow, layered panels, and smooth emphasis. Use NFH colors and original layouts.
- [Dribbble: Glass morphism E-Comm App](https://dribbble.com/shots/26809995-Glass-morphism-E-Comm-App-Modern-Clean-Immersive-UI): inspiration for soft depth and readable type over frosted surfaces; avoid copying its neon/dark palette.
- [Awwwards: Finely Crafted](https://www.awwwards.com/sites/finely-crafted): inspiration for measured menu transitions and immersive fashion storytelling. Do not let an editorial transition obstruct checkout.

## 2. Brand foundation

- **Logo:** use the approved plain-H `NFH-logo.svg`; no beak, glitter, extra pictogram, or tangerine accent. Place a copy at `public/brand/NFH-logo.svg` when integrating.
- **Typeface:** [Barlow](https://fonts.google.com/specimen/Barlow). Use 700–800 for display, 600–700 for navigation and buttons, 400–500 for product copy and form text. Keep body text legible; avoid ultra-tight tracking below 18px. Use a system sans fallback while it loads.
- **Voice:** concise, assured, welcoming. Prefer “Discover your next favorite” over exaggerated luxury claims.
- **Photography:** real outfits on varied women, garment details and fabric texture, consistent color grading, practical crop and fit representation. Never stretch imagery or place important garment areas under text/glass.

### Color roles

The supplied Tailwind scales below are the source of truth. A role can use a nearby shade to achieve contrast, but do not replace the brand palette.

| Role | Preferred token | Use |
| --- | --- | --- |
| Page canvas | `nasi-ivory-50` `#FFF8F3` | Main backgrounds; allow white `surface-50` for quiet content areas |
| Primary text and solid CTA | `nasi-blackberry-900` `#291637` | Headings, body text, filled controls |
| Rich dark surfaces | `nasi-blackberry-950`, `-900` | Footer, special editorial panels, dark hero overlay |
| Brand accent | `nasi-orchid-500` `#DF348D` | Small accents, focus, active indicators, promotional graphics; use `-700` or darker for small text on ivory |
| Secondary warm accent | `nasi-tangerine-500` `#FF875E` | Occasional sale/editorial details only; **do not put it in the approved logo** |
| Borders/dividers | `nasi-blackberry-200`, `surface-200` | Low-noise structure; assess contrast over glass |
| Success, warning, critical | supplied semantic scales | Stock messages, validation, and transaction states; never use brand pink as an error color |

Prefer blackberry-on-ivory for ordinary copy. Do not put small orchid-500 text on ivory or ivory text on orchid-500 without checking contrast. On photography, add an opaque/gradient backing behind copy.

### Authoritative palette

```js
// Tailwind colors object supplied for this project.
// Integrate in the project's existing Tailwind configuration style.
const colors = {
  "nasi-blackberry": {
    50: "#F8F4FA", 100: "#F0E7F3", 200: "#DECEE5", 300: "#C5A7D0",
    400: "#A77EBA", 500: "#85599B", 600: "#6E4383", 700: "#543265",
    800: "#3D234C", 900: "#291637", 950: "#190C22",
  },
  "nasi-orchid": {
    50: "#FFF0F8", 100: "#FFE0F0", 200: "#FFBCE0", 300: "#F789C4",
    400: "#EB5AA8", 500: "#DF348D", 600: "#C42175", 700: "#A01A5E",
    800: "#7F174C", 900: "#5E143B", 950: "#3D0926",
  },
  "nasi-tangerine": {
    50: "#FFF5EE", 100: "#FFE9D9", 200: "#FFD0B5", 300: "#FFB590",
    400: "#FF9A73", 500: "#FF875E", 600: "#F3683F", 700: "#D64C2D",
    800: "#A83726", 900: "#7B281F", 950: "#47160F",
  },
  "nasi-ivory": {
    50: "#FFF8F3", 100: "#FCEFE6", 200: "#F6DFD0", 300: "#EBCAB6",
    400: "#DDB097", 500: "#CA947A", 600: "#AD765D", 700: "#8E5B46",
    800: "#6B4335", 900: "#4A2C24", 950: "#2E1A16",
  },
  "success-green": {
    50: "#ddf5e3", 100: "#bbecc7", 200: "#99e3ac", 300: "#77d990",
    400: "#55d074", 500: "#34c759", 600: "#2ba54a", 700: "#22843b",
    800: "#1a632c", 900: "#11421d", 950: "#08210e",
  },
  "warning-orange": {
    50: "#ffecdb", 100: "#ffd9b7", 200: "#ffc693", 300: "#ffb36f",
    400: "#ffa04b", 500: "#ff8d28", 600: "#d47521", 700: "#aa5e1a",
    800: "#7f4614", 900: "#552f0d", 950: "#2a1706",
  },
  "critical-red": {
    50: "#ffddde", 100: "#ffbcbe", 200: "#ff9b9d", 300: "#ff7a7d",
    400: "#ff595c", 500: "#ff383c", 600: "#d42e32", 700: "#aa2528",
    800: "#7f1c1e", 900: "#551214", 950: "#2a090a",
  },
  surface: {
    50: "#ffffff", 100: "#f5f5f5", 200: "#e1e1e1", 300: "#d9d9d9",
    400: "#c1c1c1", 500: "#ababab", 600: "#616161", 700: "#464646",
    800: "#2F2F2F", 900: "#1C1C1C", 950: "#111111",
  },
};
```

## 3. Liquid glass and motion

Use glass selectively for the sticky navbar, image-caption chips, floating CTAs, cart/profile shells, filter trays, and editorial section overlays. Product descriptions, form fields, checkout totals, and legal copy should sit on stable, readable surfaces.

**Glass recipe:** translucent ivory/white or blackberry fill; subtle inner highlight; 1px pale border; soft shadow; background blur roughly 12–24px; restrained saturation. Implement a solid-color fallback when `backdrop-filter` is unavailable. Ensure the entire panel, not just the text shadow, provides readable contrast against changing images. Do not blur product images themselves.

**Fluid CTA:** use a rounded capsule (roughly 999px), animated highlight or subtle shape/width response on hover/press, 150–250ms easing, visible focus ring. Primary commerce actions remain stable in place and show a clear pressed/loading/disabled state. Avoid cursor-chasing buttons or morphing that shifts neighboring content.

Motion: gentle entrance (small translate/fade), image crossfade, hover elevation no more than a few pixels, drawer slide with backdrop fade. Respect `prefers-reduced-motion` and disable ornamental motion there. No scroll hijacking or mandatory animations.

## 4. Responsive system

Use content-driven CSS, then apply this explicit overlay behavior. A change of orientation while an overlay is open must reflow it in place without losing state.

| Viewport | Navigation and grid | Cart/profile overlay |
| --- | --- | --- |
| Mobile, generally under 768px | Compact logo, menu, cart, profile/login; 2-column product grid when cards remain readable, otherwise 1 column | Full-viewport cover including safe areas; internal scrolling; fixed header and bottom action area |
| Portrait tablet, roughly 768–1099px | Compact/full navigation according to available width; 2–3 columns | Full-viewport cover; recommendations below cart items, profile tabs above content |
| Landscape tablet, roughly 768–1099px wide | Expanded navigation if it fits; 3 columns | Wide **L2 drawer** from right over dimmed page; recommendation rail beside cart; sidebar beside profile |
| Desktop, 1100px and wider | Full nav; 3–4 product columns; generous editorial whitespace | Wide right L2 drawer; side-by-side rails and content |

Suggested overlay rule: full cover if viewport width < 768px **or** (width < 1100px and orientation is portrait); otherwise wide drawer. The rule is based on viewport, not a device user-agent. Check height as well so short landscape viewports can scroll comfortably. Do not truncate controls on zoomed screens.

**L2 drawer** here means an elevated second-layer surface above the existing page with a dimmed backdrop; it is not a route replacement. Do not open cart and profile simultaneously.

## 5. Global shell and navigation

- One shared `Navbar` used over the hero and on all pages. It is sticky at top with a high but managed stacking context. Over a dark hero it may use an ivory-on-blackberry glass variant; after leaving the hero use an ivory frosted variant. Preserve the same geometry and links.
- Desktop: NFH logo, Home / Shop / Sale / Blog links, search access, likemarks, bag count, and **Login + Sign up** controls for guests. Authenticated state replaces guest controls with a profile icon and accessible name; bag and likemarks stay visible.
- Mobile: NFH mark, menu, search, bag, account; menu opens an accessible full-height panel. Keep primary links within one tap.
- Active route is visibly marked; sticky bar remains readable above imagery and does not cover anchored headings.
- Footer shared across public pages: NFH brand line, Shop / Help / Company links, newsletter, contact/social placeholders, legal links and actual policy routes once available. Do not publish placeholder address, policies, or support promises as factual.

## 6. Page blueprints

### Home `/`

1. Shared sticky navbar overlaying an editorial hero with a short seasonal eyebrow, exact tagline “Style without compromise.”, brand description in shortened form, and “Shop the collection” CTA.
2. Hero composition: full-width soft-ivory or dark-blackberry background with a staggered capsule gallery of real outfit photos. Preserve a readable copy zone; alternate static image and reduced-motion fallback instead of a mandatory carousel.
3. Category quick links; “New & Noted” **MerchCard listing section**; campaign feature strip; “Everyday elegance” editorial story; Sale preview; testimonials; FAQ; newsletter/blog invitation; footer.
4. Keep shipping/returns claims out until verified.

### Shop `/shop`

- Intro heading and item count. At the **top**, a single-row horizontally scrolling category rail: All, Shirts, T-shirts, Sarees, Gowns, Office Wear, Pants, Dresses, Co-ords, Kurtas, Jackets, Accessories; actual categories must come from catalog later. Provide keyboard scrolling and visible active state.
- **Directly below** the category rail: prominent search bar with clear action. Filters and sorting follow; on desktop use an unobtrusive filter row/side panel and on mobile a filter sheet.
- Responsive MerchCard grid with skeleton, empty, error, and pagination/load-more states. Keep search/filter/sort state shareable in URL query parameters.

### Sale `/sale`

- Distinct but restrained campaign banner; category/filter/sort controls; visible original price, current price, and discount when valid. Use tangerine sparingly for promotional accents. Never fabricate countdowns or crossed-out prices.

### Blog `/blog`, article `/blog/:slug`

- Editorial index with a featured story, article cards, tags, and newsletter prompt. Article page uses readable measure, strong imagery, author/date only if supplied, related stories, and the shared footer.

### Product `/product/:slug`

- Above fold: gallery with thumbnails (swipe on touch), breadcrumb, product name, price, sale state, color/size selectors, size guide if data exists, stock message, likemark, add-to-bag quantity control, shipping information only if known.
- Desktop gallery/details side by side; tablet stacks according to available width; mobile gallery first and sticky purchase action as appropriate.
- Below: “Pair with” small horizontal cards, fabric/care/details sections, recommendations, genuine reviews if available, product FAQ if available, newsletter and footer. Gallery and source images must have meaningful alt text.

### Login `/login` and Sign up `/signup`

- Calm split editorial image/form layout on desktop, single-column on mobile. Clear labels, password visibility, errors, and navigation between screens. No fake social sign-in buttons.

### Payment `/checkout/payment`

- Focused checkout shell: address, delivery choice if supported, order summary, payment method placeholder, price breakdown, and clear secure-payment messaging only when integration exists. Stable opaque panels, no glass behind critical totals. Razorpay is a future integration; do not collect card credentials or simulate a paid order.

## 7. Core component treatments

**MerchCard:** portrait image (consistent aspect ratio, e.g. 4:5), small category/label when real, name, price, sale price when real, optional swatches, likemark, and the CTA. First action is `Add to bag`; once a valid variant is in the cart, the same region becomes `− quantity +`. Clamp increments to known stock; decrementing from one removes the line and returns the add CTA. Keep controls visible and 44px touch targets.

**Cart overlay:** in L2 mode, a 200–260px recommendations rail sits to the left of a 420–560px cart region, both within the overlay. The recommendations rail shows contextual items with image, title, price and Quick add/Select options. Main region shows header, scrollable line items with variant/quantity/remove, and a pinned subtotal/checkout summary. On full cover, move recommendations **below cart lines but above the final sticky summary**; if empty, show a compact edit/picks prompt. Recommendations never obscure totals or the close control.

**Profile overlay:** wide right overlay with left sidebar (identity summary, Profile, Orders, Likemarks, sign out) and right content pane. On full cover use a compact header and horizontal tabs; content scrolls beneath. Orders show status and line summary; likemarks use MerchCards. Make “Bookmarks” in the supplied screenshot read “Likemarks” in NFH copy.

**FAQ:** keyboard-operable accordion with clear question, answer and expand indicator; questions and policy answers must be sourced from real business content.  
**Testimonials:** carousel or 2–3 cards using genuine attributable testimonials only; use a non-claim editorial block until available.  
**Newsletter/blog subscribe:** concise value proposition, email field, consent where appropriate, pending/success/error states backed by a service when integrated.

## 8. Spacing, accessibility, and implementation checks

- Container max-width about 1440px; side gutters 16/24/40px for mobile/tablet/desktop; 8px spacing rhythm; consistent corner family (small controls ~12px, cards ~20px, pills full round).
- Target WCAG AA contrast for text and controls. Never depend on color alone for sale, error, selected size, or like state. Visible keyboard focus; labelled icons; semantic headings; logical tab order; 44×44px touch targets.
- Overlays have labelled titles, focus trap, Escape and close action, focus return, body scroll lock and independent content scrolling. Honor browser back behavior as defined in LOGIC.md.
- Check 320px mobile width, 390px mobile, 768px portrait tablet, 1024px landscape tablet, and 1440px desktop, plus 200% zoom. Verify navbar, CTA transformations, empty states, overlong product titles, prices, and forms.
- Budget visual effects: blur only bounded panels, load responsive images lazily below fold, preload a single hero image and font subset, and avoid animating layout or expensive full-page filters.

## 9. Component ownership

```text
src/
  components/
    ui/            # Button, GlassPanel, IconButton, ModalLayer, QuantityStepper,
                   # MerchCard, Price, Input, Accordion, ImageGallery, Skeleton
    sections/      # Navbar, Footer, Hero, CategoryRail, MerchGrid,
                   # Testimonials, FaqSection, NewsletterSection,
                   # CartRecommendations, CartDrawer, ProfileDrawer
    pages/         # HomePage, ShopPage, SalePage, BlogPage, ArticlePage,
                   # ProductPage, LoginPage, SignupPage, PaymentPage,
                   # NotFoundPage
  assets/          # licensed local placeholders only; server media later
```

Reusable `ui` components own visual primitives, `sections` assemble content and interactions, and `pages` compose routes. Keep business rules out of `ui` components; see LOGIC.md.
