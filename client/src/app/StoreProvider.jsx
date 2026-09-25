import { useMemo, useReducer } from 'react';
import { getVariant } from '../features/catalog/api';
import { StoreContext } from './StoreContext';

const STORAGE_KEY = 'nfh-demo-store-v1';

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const lines = Array.isArray(parsed.lines) ? parsed.lines.filter((line) =>
      typeof line.productId === 'string' && typeof line.variantId === 'string' &&
      Number.isInteger(line.quantity) && line.quantity > 0 && getVariant(line.productId, line.variantId)
    ).map((line) => {
      const variant = getVariant(line.productId, line.variantId);
      return { ...line, quantity: Math.min(line.quantity, variant.stock ?? line.quantity) };
    }) : [];
    const likes = Array.isArray(parsed.likes) ? parsed.likes.filter((id) => typeof id === 'string') : [];
    return { lines, likes };
  } catch { return { lines: [], likes: [] }; }
}

function reducer(state, action) {
  let next = state;
  if (action.type === 'quantity') {
    const variant = getVariant(action.productId, action.variantId);
    if (!variant?.available) return state;
    const existing = state.lines.find((line) => line.variantId === action.variantId);
    const quantity = Math.max(0, Math.min((existing?.quantity || 0) + action.delta, variant.stock ?? Infinity));
    const lines = state.lines.filter((line) => line.variantId !== action.variantId);
    if (quantity) lines.push({ productId: action.productId, variantId: action.variantId, quantity });
    next = { ...state, lines };
  }
  if (action.type === 'remove') next = { ...state, lines: state.lines.filter((line) => line.variantId !== action.variantId) };
  if (action.type === 'like') next = { ...state, likes: state.likes.includes(action.productId) ? state.likes.filter((id) => id !== action.productId) : [...state.likes, action.productId] };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Browsing remains available without storage. */ }
  return next;
}

export default function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const value = useMemo(() => ({
    lines: state.lines, likes: state.likes,
    count: state.lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotalPaise: state.lines.reduce((sum, line) => sum + (getVariant(line.productId, line.variantId)?.price.amountPaise || 0) * line.quantity, 0),
    quantityFor: (variantId) => state.lines.find((line) => line.variantId === variantId)?.quantity || 0,
    changeQuantity: (productId, variantId, delta) => dispatch({ type: 'quantity', productId, variantId, delta }),
    removeLine: (variantId) => dispatch({ type: 'remove', variantId }),
    toggleLike: (productId) => dispatch({ type: 'like', productId }),
  }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
