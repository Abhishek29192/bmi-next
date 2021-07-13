import React from "react";
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import { render } from "@testing-library/react";

// https://testing-library.com/docs/example-reach-router/
export function renderWithRouter(
  ui,
  { route = "/", history = createHistory(createMemorySource(route)) } = {}
) {
  return {
    ...render(<LocationProvider history={history}>{ui}</LocationProvider>),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history
  };
}
