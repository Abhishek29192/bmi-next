// solution taken from https://dev.to/justincy/using-next-i18next-in-storybook-3he9
import React from "react";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";

i18n.use(initReactI18next).init({
  localeDetection: false,
  lng: "en"
});

export const I18nDecorator = (Story) => (
  <I18nextProvider i18n={i18n}>
    <Story />
  </I18nextProvider>
);
