import {
  createHistory,
  createMemorySource,
  LocationProvider
} from "@reach/router";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import * as Gatsby from "gatsby";
import Visualiser from "../Visualiser";
import { Props } from "../visualiser/Visualiser";
import { SiteContextProvider } from "../Site";
import { getMockSiteContext } from "./utils/SiteContextProvider";

const data = { productPath: "", variantCode: "" };
const navigateSpy = jest.spyOn(Gatsby, "navigate");

jest.mock("react", () => {
  const VisualiserMock = (props: Props) => (
    <div>
      <button
        onClick={() =>
          props.onClick({
            label: "",
            type: "",
            data
          })
        }
      >
        Navigate to PDP page
      </button>
    </div>
  );

  return {
    ...jest.requireActual<Record<string, unknown>>("react"),
    lazy: jest.fn().mockImplementation(() => VisualiserMock)
  };
});

afterEach(() => {
  navigateSpy.mockRestore();
  data.productPath = undefined;
  data.variantCode = undefined;
});

describe("Visualiser", () => {
  it("navigates to correct pdp page using productPath prop", () => {
    data.productPath = "/p/product-url/";
    const route = "/no?tileId=1";
    const history = createHistory(createMemorySource(route));

    render(
      <LocationProvider history={history}>
        <SiteContextProvider value={getMockSiteContext("no")}>
          <Visualiser
            contentSource="https://mock_url"
            houseTypes={[]}
            variantCodeToPathMap={{}}
          >
            <div />
          </Visualiser>
        </SiteContextProvider>
      </LocationProvider>
    );

    fireEvent.click(screen.getByText("Navigate to PDP page"));
    expect(navigateSpy).toHaveBeenCalledWith("/no/p/product-url/");
  });

  it("navigates to correct pdp page using variantCodeToPathMap property", () => {
    data.variantCode = "mocked_product_code";
    const route = "/no?tileId=1";
    const history = createHistory(createMemorySource(route));

    render(
      <LocationProvider history={history}>
        <SiteContextProvider value={getMockSiteContext("no")}>
          <Visualiser
            contentSource="https://mock_url"
            houseTypes={[]}
            variantCodeToPathMap={{
              mocked_product_code: "/p/mocked-product-page"
            }}
          >
            <div />
          </Visualiser>
        </SiteContextProvider>
      </LocationProvider>
    );

    fireEvent.click(screen.getByText("Navigate to PDP page"));
    expect(navigateSpy).toHaveBeenCalledWith("/no/p/mocked-product-page/");
  });

  it("should not navigate to the product page if pathWithCountryCode is undefined", () => {
    data.variantCode = "";
    data.productPath = "";
    const route = "/no?tileId=1";
    const history = createHistory(createMemorySource(route));

    render(
      <LocationProvider history={history}>
        <SiteContextProvider value={getMockSiteContext("no")}>
          <Visualiser
            contentSource="https://mock_url"
            houseTypes={[]}
            variantCodeToPathMap={{}}
          >
            <div />
          </Visualiser>
        </SiteContextProvider>
      </LocationProvider>
    );

    fireEvent.click(screen.getByText("Navigate to PDP page"));
    expect(navigateSpy).toHaveBeenCalledTimes(0);
  });
});
