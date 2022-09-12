import React from "react";
import Confirmation from "../";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";

const optionSpy = jest.fn();
jest.mock("react-i18next", () => {
  const original = jest.requireActual("react-i18next");
  return {
    ...original,
    useTranslation: () => {
      return {
        t: (str, options) => {
          optionSpy(options);
          return options?.returnObjects ? [str] : str;
        }
      };
    }
  };
});

const useMarketContextSpy = jest
  .fn()
  .mockImplementation(() => ({ market: "en" }));
jest.mock("../../../../context/MarketContext", () => {
  return {
    useMarketContext: () => useMarketContextSpy()
  };
});

describe("Confirmation", () => {
  const baseUrl = "www.bmigroup.com";
  it("render correctly", () => {
    const { container } = renderWithI18NProvider(
      <Confirmation baseUrl={baseUrl} environment={"dev"} />
    );

    expect(container).toMatchSnapshot();
    expect(screen.queryByText("confirmation.title")).toBeTruthy();
    expect(optionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        website: `<a href="/">www.bmigroup.com</a>`
      })
    );
  });

  it("change website link with correctly", () => {
    const { container } = renderWithI18NProvider(
      <Confirmation baseUrl={baseUrl} environment={null} />
    );

    expect(container).toMatchSnapshot();
    expect(screen.queryByText("confirmation.title")).toBeTruthy();
    expect(optionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        website: `<a href="/en">www.bmigroup.com/en</a>`
      })
    );
  });
});
