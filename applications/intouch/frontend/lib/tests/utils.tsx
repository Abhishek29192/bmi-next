import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import I18nextProvider from "./fixtures/i18n";
import UserProvider from "./fixtures/user";

export * from "@testing-library/react";

export const renderWithI18NProvider = (Component: JSX.Element) =>
  render(<I18nextProvider>{Component}</I18nextProvider>);

export const renderWithUserProvider = (Component: JSX.Element) =>
  render(
    <I18nextProvider>
      <UserProvider>{Component}</UserProvider>
    </I18nextProvider>
  );
