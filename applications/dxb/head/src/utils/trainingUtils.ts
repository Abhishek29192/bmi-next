export const getPriceLabel = (
  price: string | number,
  currencySymbol: string,
  fallback: string
) => (Number(price) ? `${currencySymbol}${price}` : fallback);
