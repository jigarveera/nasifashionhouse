# Nasi Fashion House — Storefront Behavior and Architecture

**Project:** React + Vite storefront  
**Companion:** [DESIGN.md](./DESIGN.md) is the visual and responsive specification.  
**Boundary:** this document specifies the storefront. Product/catalog data, user accounts, image delivery, payments, and the admin panel will connect to server services later.

Keep styling tied to the shared DESIGN.md tokens (including `nasi-ivory` and `nasi-blackberry`), so feature components do not create their own competing color rules.

## 1. Scope and build approach

Build working client-side navigation and meaningful shopping interactions with a replaceable mock data layer. Pages must support loading, empty, success, and error presentations without inventing real purchases, orders, reviews, subscribers, or payment success.

| Build now | Prepare contract for later | Do not pretend is complete |
| --- | --- | --- |
| Home, Shop, Sale, Blog, Login, Sign up, Product, Payment page shells; responsive cart/profile overlays; local cart; filters and search over fixture data; variant-aware quantity CTA; likes as local demo state; FAQ interaction | Catalog/search, identity, addresses, orders, reviews, recommendations, newsletter, inventory, checkout session, media URLs, Razorpay server handoff | Charging money, creating paid orders, authenticating real users, delivering newsletters, enforcing live stock, admin management |

Use TypeScript interfaces below even if the current Vite app uses JSX; in a JavaScript project, implement equivalent runtime validation and clear JSDoc. Do not add a dependency only because it is named here; reuse what the project already has.

## 2. Routing

Use one `BrowserRouter` near `main.jsx` and `Routes` within `App`; never nest another router. Lazy-load pages with a meaningful fallback. Keep `Navbar` and `Footer` in the public layout rather than duplicating them in pages.

| Path | Page/behavior |
| --- | --- |
| `/` | Home |
| `/shop` | Catalog; optional `category`, `q`, `sort`, filter, and `page` URL params |
| `/sale` | On-sale catalog, same filter model |
| `/blog` | Blog index |
| `/blog/:slug` | Blog article or not-found |
| `/product/:slug` | Product details or not-found |
| `/login` | Guest login screen |
| `/signup` | Guest sign-up screen |
| `/checkout/payment` | Checkout/payment UI scaffold; no real charge before integration |
| `*` | Branded not-found page with Shop and Home actions |

Cart and profile are overlays on the current route. Preserve the page underneath; optionally mirror overlay state in URL search params (`panel=cart`, `panel=account&tab=orders`) so Back closes an overlay before leaving a page. Keep existing catalog query params when doing this. If someone directly opens an account overlay URL without a background page, render a valid full-viewport account shell, not an empty page. Do not expose private order data before auth exists.

## 3. Project organization

```text
src/
  app/              # App routes, public layout, providers, overlay coordinator
  components/
    ui/             # Pure primitives: button, input, price, card, stepper, sheet
    sections/       # Shared compositions: navbar, hero, merch grid, cart,
                    # profile, footer, newsletter, FAQ, testimonials
    pages/          # Route-level components only
  features/
    catalog/        # queries, filter/sort utilities, mock adapter
    cart/           # cart reducer/store, selectors, persistence, validation
    auth/           # session adapter and auth state
    likes/          # likemarks adapter/state
    checkout/       # checkout draft, totals display, provider boundary
    blog/           # articles adapter
  data/             # explicit, labelled fixtures; not mixed into components
  lib/              # money, URL params, responsive overlay utilities
  styles/           # font and global styles, glass tokens
public/brand/       # approved NFH-logo.svg after copying into the app
```

Pages compose sections; sections coordinate features; UI primitives receive props and callbacks. All content rendering obtains data through feature adapters, not hardcoded inside cards. Start with in-memory fixtures and swap adapters for fetch functions later.

## 4. Data shapes and invariants

```ts
type Currency = "INR";
type Money = { amountPaise: number; currency: Currency };
type ProductImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};
type ProductVariant = {
  id: string;                  // stable SKU/variant ID from server later
  size?: string;
  color?: string;
  available: boolean;
  stock?: number;              // unknown until inventory is integrated
  price: Money;
  compareAtPrice?: Money;      // show a discount only when valid
};
type Product = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  description: string;
  images: ProductImage[];
  variants: ProductVariant[];
  tags?: string[];
  isFeatured?: boolean;
  published: boolean;
};
type CartLine = {
  productId: string;
  variantId: string;
  quantity: number;            // positive integer; max from known stock
};
type CatalogQuery = {
  categoryId?: string;
  q?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest";
  page?: number;
  filters?: Record<string, string[]>;
};
```

- Use one cart line per `variantId`. Names/images/prices come from the catalog response; never rely on stale persisted price at checkout.
- Format money with `Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })`; convert integer paise for display. No float arithmetic for subtotal/tax/discount.
- Empty/unknown product images use a branded placeholder with useful alt text. Never assume an array has at least one image.
- A `sale` product must have a legitimate current price lower than a legitimate compare-at price or a server-defined promotion. Do not manufacture discount percentages.
- Server data is authoritative for availability and final totals. Mock stock and copy are demo values only.

## 5. Shared application state

| State | Source now | Later source | Persistence |
| --- | --- | --- | --- |
| Catalog/categories/blog | Fixture adapter | Server endpoints | Query cache when added |
| Search/category/sort/page | URL search params | Same + server query | URL |
| Open overlay and active account tab | Shared UI state, optionally URL | Same | URL for Back/deep link |
| Cart lines | Cart reducer/context or existing store | Server cart for signed-in users and guest merge | Local storage with schema/version and safe recovery |
| Likemarks | Local demo set | Authenticated wishlist | Local storage for demo only |
| Session/profile | Explicit guest by default | Auth endpoint/session | No invented login or stored password |
| Checkout address/delivery draft | Component state | Server-backed checkout session | Memory until legitimate persistence is built |

Keep API and cart mutations idempotent where possible. If local storage is unavailable/corrupt, recover to an empty cart without crashing. Do not store passwords, card details, payment IDs, or sensitive profile data in local storage.

## 6. Navigation and auth behavior

- Navbar is one shared component on hero and every public route; it remains sticky. Its colors/opacity adapt on scroll without replacing the component.
- Guest: Login and Sign up calls to action. Authenticated: accessible profile icon replaces both. Shopping bag remains visible in either state.
- A click on the profile icon opens the account overlay with Profile selected. Profile sidebar/tab destinations are Profile, Orders, and Likemarks.
- Login/sign-up screens validate visible fields and show useful errors. Until real auth exists, use a clearly labelled development fixture only or keep submission disabled with explanatory copy. A fake success session must not appear in the actual customer build.
- On eventual login, merge a guest cart with server cart by variant ID using a deliberate conflict policy; fetch server likemarks and profile. On sign-out, clear private state and choose whether to retain a guest cart. Never show another user's cached orders.

## 7. Catalog and product discovery

1. Category rail on Shop appears above the search bar. Source categories from data; allow horizontal overflow with scroll/keyboard reachability and clear active selection. Names shown in design fixtures may include Shirts, T-shirts, Sarees, Gowns, Office Wear, Pants, Dresses, Co-ords, Kurtas, Jackets, and Accessories; do not treat this list as the backend enum.
2. Search is case-insensitive on names/descriptions/tags in fixture mode; trim input, debounce typing (roughly 200–300ms), update `q` in the URL, and reset `page` when the query changes. Server search replaces the adapter later.
3. Filter and sort selections update URL params without dropping other selections. “Clear all” resets filters/search and preserves the page route. Provide total results count and an empty result with reset action.
4. Sale reuses catalog components with `onSale` as a genuine data predicate. The sale route and Shop may share grid/filter primitives.
5. Product page resolves slug, selects an available variant deliberately, syncs gallery selection and chosen color where images are variant-specific, and enables Add only when choices are valid. A missing size must trigger a clear selection prompt.
6. Never imply a quick-add item has a chosen size if multiple sizes exist. Quick add may directly add a single valid variant; otherwise open a lightweight size/color selector.

## 8. MerchCard interaction contract

Render image, name, product detail link, current price, compare-at price if valid, like toggle, and cart action from the same product model on Home, Shop, Sale, recommendations, and Likemarks.

| Current state | Visible action | Result |
| --- | --- | --- |
| No selected/valid variant in cart | `Add to bag` | Add sole valid variant or request required size/color |
| Selected variant in cart, qty ≥ 1 | `−  qty  +` in the same CTA footprint | Increment/decrement this exact variant |
| Qty = 1 and minus pressed | Switches back to `Add to bag` | Remove that line |
| Stock known and qty at max | Plus disabled with stock explanation | No oversell |
| Variant unavailable | `Sold out` or select other variant | Cannot add |
| Mutation pending/failing when server exists | Pending state, then commit or restore | Explain error; no silent desync |

Use one shared cart selector so the count is identical on card, product page, drawer, and navbar. Stop CTA/likemark clicks from navigating to the product page. Keyboard and pointer behavior must match.

## 9. Cart L2 overlay and recommendations

**Open/close:** bag icon opens; backdrop, labelled close control, and Escape close; Back closes if represented in URL. Opening Profile closes Cart. Lock page scroll, trap focus, and return focus to the trigger after closing. If viewport rotates, retain the cart lines and scroll to a sensible position.

**Landscape tablet/desktop:** overlay from right with backdrop; width approximately 700–900px, bounded by viewport. Two internal regions: recommended items rail at left and cart at right. Cart header and total/checkout area remain visible while line items scroll. Cart is not a permanent page sidebar.

**Mobile/portrait tablet:** full-viewport cover. Order: cart header, cart lines, recommendations, pinned total and checkout action. Recommendations become a horizontally scrollable row or a small grid above the pinned summary, not a second narrow column. Allow inner scrolling and safe-area padding.

**Recommendation selection:** prefer complementary items in the same outfit/style or nearby category from server later; in fixture mode use explicitly curated `relatedProductIds` where present. Exclude unavailable and already-carted variants, deduplicate, cap to 2–4 relevant products, and show a small editorial empty state if none qualify. Provide Quick add only if variant choice is unambiguous; otherwise “Choose options” opens the product or inline picker. Do not claim personalization without a recommendation service.

**Cart math:** subtotal = sum(current variant price × quantity). Shipping, discounts and tax are shown only if reliably supplied; otherwise label “Calculated at checkout” and never display fake “Free shipping”. Checkout action is disabled when empty. Before future order creation, server must reprice and validate stock.

## 10. Profile L2 overlay

- Landscape tablet/desktop: left navigation sidebar with identity summary, Profile, Orders, Likemarks and Sign out; right pane renders selected content. Provide persistent heading and close action.
- Mobile/portrait tablet: full-cover pane with header and scrollable Profile / Orders / Likemarks tabs above content. Account sections each have loading, empty, and error states.
- Profile: editable name and contact fields only after account service integration; address editor remains a scoped future feature unless data exists. Orders: show actual order status, date, items and totals; no fabricated orders. Likemarks: a MerchCard listing of saved products; like/unlike works in demo state.
- Guest profile action should route to Login rather than exposing private-looking fake account details. Preserve intended destination so login can return to the requested section later.

## 11. Checkout and payment boundary

Payment route represents the beginning of checkout, not a completed payment implementation.

1. If cart is empty, show an empty checkout with “Continue shopping”; do not create a payment session.
2. Capture/confirm address and delivery choice only when corresponding service/policies exist. Present itemized cart and current known subtotal. Make unknown shipping/tax explicit.
3. On future integration, backend validates prices/inventory, creates an order intent, then creates a Razorpay order and returns only the public data needed by the client. The client opens the Razorpay checkout with a server-provided order ID.
4. Backend verifies the payment result/signature and authoritative payment status before marking an order paid. Client callback, redirect, or screenshot is not proof of payment. Provide failure, cancellation, retry and pending states without duplicating orders.
5. Until those endpoints exist, the real `Pay` control must be unavailable or clearly labelled as a non-transactional preview. Never collect or store card numbers in the app.

Admin order management and product editing are a **separate future protected application area**. Do not surface admin controls in the public storefront or implement mock “order updated” actions as production behavior.

## 12. Blog, newsletter, FAQ, testimonials

- Blog listing supports featured article, tags, search/filter if content volume justifies it, article detail, and an honest empty state. Article bodies come from a trusted content adapter later; sanitize/render safely.
- Newsletter form checks email format, shows pending/success/error states, and submits to a real endpoint when available. Before that, do not show a false “You're subscribed” confirmation or save addresses merely for a demo.
- FAQ uses genuine merchant-provided answers; do not state return/shipping terms from a design mock. Accordion behavior supports multiple open sections only if content length warrants it.
- Testimonials/reviews need genuine verified content and permission to display names/photos; omit fabricated ratings and counts from fixtures shown to customers.

## 13. Adapter contract for server handoff

Keep a consistent shape for mock and live implementations:

```ts
interface StorefrontApi {
  getHome(): Promise<HomeContent>;
  getCategories(): Promise<Category[]>;
  getProducts(query: CatalogQuery): Promise<Paginated<Product>>;
  getProduct(slug: string): Promise<Product | null>;
  getRelated(productId: string): Promise<Product[]>;
  getCartRecommendations(lines: CartLine[]): Promise<Product[]>;
  getArticles(query?: ArticleQuery): Promise<Paginated<Article>>;
  getArticle(slug: string): Promise<Article | null>;
  subscribe(email: string): Promise<void>;
  // Auth, account, cart sync, checkout and orders are added when APIs exist.
}
```

Centralize `VITE_API_BASE_URL` handling, timeouts, error translation, and loading states in the adapter. A missing environment variable may select an explicit fixture mode during design development; avoid silently treating fixture data as a successful live response. Keep server image URLs and alt text in data rather than components. Validate incoming response shapes and treat unavailable images gracefully.

## 14. Accessibility, resilience, and acceptance checklist

- Semantic links for navigation, buttons for actions, labelled form controls, correct `aria-expanded` for accordions, announced errors, and visible keyboard focus.
- Overlay keyboard trap, Escape close, focus return, backdrop click behavior, `role=dialog`, labelled title, and scroll lock. No focus behind an open drawer.
- Page transitions retain sensible scroll position; navigating to a new page starts at top unless back-navigation restores the previous position.
- Add and quantity actions update every surface consistently; changing product size reflects the specific SKU's quantity and availability.
- URL-based category/search/sort survives refresh and browser Back. Empty cart and empty search have useful recovery actions.
- Test viewport/orientation changes with an open cart and profile; confirm recommendations move to the correct position without disappearing.
- Check guest and authenticated navigation conditions separately. Until genuine auth integration, guest is the production default.
- Checkout never reports paid on frontend-only state and never calculates unverified tax/shipping as fact.
- Use real image dimensions or aspect ratios to avoid layout shift; honor reduced motion and low-bandwidth conditions.

## 15. Build sequence for Codex

1. Set up brand tokens, font, logo, page shell and shared navbar/footer.
2. Add explicit fixture adapters and product/category data types.
3. Implement Home, Shop and Sale with reusable MerchCard, URL search/filter/sort and responsive hero.
4. Implement Product page, variant choices, cart reducer, quantity transformation, recommendation selection, and responsive cart overlay.
5. Implement Blog/article, FAQ, testimonial/content placeholders and newsletter form with honest service-state behavior.
6. Add Login/Sign up UI and account overlay architecture without a fake production session.
7. Add checkout/payment scaffold, loading/empty/error states, accessibility passes, responsive passes, then connect actual server endpoints as they become available.

This sequence produces reviewable storefront behavior while preserving clear boundaries for Razorpay and the later admin panel.
