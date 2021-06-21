import React from "react";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "en",
  react: {
    useSuspense: false
  }
});

const Provider = ({ children }: { children: React.ReactNode }) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default Provider;
