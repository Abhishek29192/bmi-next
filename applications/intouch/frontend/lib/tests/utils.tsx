import { ThemeProvider } from "@bmi/components";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { NextRouter } from "next/router";
import React from "react";
import { generateAccount } from "./factories/account";
import { generateMarketContext } from "./factories/market";
import {
  default as AccountContextWrapper,
  default as AccountProvider
} from "./fixtures/account";
import ApolloProvider from "./fixtures/apollo";
import I18nextProvider from "./fixtures/i18n";
import {
  default as MarketContextWrapper,
  default as MarketProvider
} from "./fixtures/market";
import UserProvider from "./fixtures/user";

export * from "@testing-library/react";

// TODO: Copied from common components, so export instead?
export const renderWithThemeProvider = (
  children: React.ReactElement
): ReturnType<typeof render> => render(children, { wrapper: ThemeProvider });

export const renderWithI18NProvider = (Component: JSX.Element) =>
  renderWithThemeProvider(<I18nextProvider>{Component}</I18nextProvider>);

export const renderWithUserProvider = (Component: JSX.Element) =>
  renderWithThemeProvider(
    <I18nextProvider>
      <UserProvider>{Component}</UserProvider>
    </I18nextProvider>
  );
export const renderWithAllProviders = (Component: JSX.Element) =>
  renderWithThemeProvider(
    <I18nextProvider>
      <UserProvider>
        <ApolloProvider>
          <MarketContextWrapper>
            <AccountContextWrapper>{Component}</AccountContextWrapper>
          </MarketContextWrapper>
        </ApolloProvider>
      </UserProvider>
    </I18nextProvider>
  );
export const renderAsReal =
  ({ account = {}, market = {} } = {}) =>
  (Component: JSX.Element) =>
    renderWithThemeProvider(
      <I18nextProvider>
        <UserProvider>
          <MarketProvider market={generateMarketContext(market)}>
            <AccountProvider account={generateAccount(account)}>
              {Component}
            </AccountProvider>
          </MarketProvider>
        </UserProvider>
      </I18nextProvider>
    );
export const renderAsDeep =
  ({ account = {}, market = {} } = {}) =>
  (Component: JSX.Element) =>
    render(
      <I18nextProvider>
        <UserProvider>
          <ApolloProvider>
            <MarketProvider market={generateMarketContext(market)}>
              <AccountProvider account={generateAccount(account)}>
                {Component}
              </AccountProvider>
            </MarketProvider>
          </ApolloProvider>
        </UserProvider>
      </I18nextProvider>
    );
export function createMockRouter(router: Partial<NextRouter>): NextRouter {
  return {
    basePath: "",
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
    back: jest.fn(),
    beforePopState: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: "en",
    domainLocales: [],
    isPreview: false,
    ...router
  };
}
