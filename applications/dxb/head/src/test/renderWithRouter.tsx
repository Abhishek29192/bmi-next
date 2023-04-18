import React from "react";
import {
  createHistory,
  createMemorySource,
  History,
  LocationProvider
} from "@reach/router";
import { render, RenderResult } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

type RenderWithRouter = (
  ui: React.ReactNode,
  {
    route,
    history
  }?: {
    route?: string;
    history?: History;
  }
) => RenderResult & { history: History };

// https://testing-library.com/docs/example-reach-router/
export const renderWithRouter: RenderWithRouter = (
  ui,
  { route = "/", history = createHistory(createMemorySource(route)) } = {}
) => ({
  ...render(<LocationProvider history={history}>{ui}</LocationProvider>),
  // adding `history` to the returned utilities to allow us
  // to reference it in our tests (just try to avoid using
  // this to test implementation details).
  history
});

export const renderToStaticMarkupWithRouter = (
  ui: React.ReactNode,
  {
    route = "/",
    history = createHistory(createMemorySource(route))
  }: { route?: string; history?: History } = {}
): { view: string; history: History } => {
  return {
    view: renderToStaticMarkup(
      <LocationProvider history={history}>{ui}</LocationProvider>
    ),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history
  };
};
