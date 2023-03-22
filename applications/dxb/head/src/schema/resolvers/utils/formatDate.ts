export const formatDate = (date: string | null): string | null => {
  // Required until Norway's locale is fixed in V8 https://bugs.chromium.org/p/v8/issues/detail?id=11897
  const locale =
    process.env.GATSBY_MARKET_LOCALE_CODE === "nb-NO"
      ? "no"
      : process.env.GATSBY_MARKET_LOCALE_CODE;
  return date
    ? new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(new Date(date))
    : null;
};
