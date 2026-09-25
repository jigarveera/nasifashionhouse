const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
export const formatMoney = (money) => formatter.format((money?.amountPaise || 0) / 100);
export const isSaleVariant = (variant) => Boolean(variant?.compareAtPrice?.amountPaise > variant?.price?.amountPaise);
