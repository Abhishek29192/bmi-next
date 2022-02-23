import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { NextRouter } from "next/router";
import I18nextProvider from "./fixtures/i18n";
import UserProvider from "./fixtures/user";
import AccountProvider from "./fixtures/account";
import MarketProvider from "./fixtures/market";
import { generateAccount } from "./factories/account";
import { generateMarketContext } from "./factories/market";
import ApolloProvider from "./fixtures/apollo";
import MarketContextWrapper from "./fixtures/market";
import AccountContextWrapper from "./fixtures/account";

export * from "@testing-library/react";

export const renderWithI18NProvider = (Component: JSX.Element) =>
  render(<I18nextProvider>{Component}</I18nextProvider>);

export const renderWithUserProvider = (Component: JSX.Element) =>
  render(
    <I18nextProvider>
      <UserProvider>{Component}</UserProvider>
    </I18nextProvider>
  );
export const renderWithAllProviders = (Component: JSX.Element) =>
  render(
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
    render(
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
