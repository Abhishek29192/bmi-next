import { Language } from "@bmi/intouch-api-types";

const locales: {
  [K in Language]: string;
} = {
  DA: "da-DK",
  NO: "no-NO",
  EN: "en-GB",
  SV: "sv-SV",
  PT: "pt-PT",
  DE: "de-DE",
  NL: "nl-NL",
  SK: "sk-SK",
  FR: "fr-FR",
  PL: "pl-PL",
  ES: "es-ES",
  FI: "fi-FI",
  IT: "it-IT"
};

export const formatDateByLanguage = (date, language: Language) => {
  const locale = locales[language.toLocaleUpperCase()];
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};
