import ThemeProvider from "@bmi-digital/components/theme-provider";
import { microCopy } from "@bmi/microcopies";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import {
  BasketContextProvider,
  Sample
} from "../../contexts/SampleBasketContext";
import { local } from "../../utils/storage";
import { getClickableActionFromUrl } from "../Link";
import SampleBasketDialog from "../SampleBasketDialog";
import { SiteContextProvider } from "../Site";
import { getMockSiteContext } from "./utils/SiteContextProvider";

const samples: Sample[] = [
  {
    name: "sample-1",
    code: "sample-1",
    path: "sample-1-details",
    colour: "green",
    textureFamily: "rough",
    measurements: "1x2x3 mm",
    image: "http://localhost:8000/image-real-file-name.jpg"
  },
  {
    name: "sample-2",
    code: "sample-2",
    path: "sample-2-details",
    colour: "red",
    textureFamily: "rough",
    measurements: "1x2x3 mm",
    image: "http://localhost:8000/image-real-file-name.jpg"
  },
  {
    name: "sample-3",
    code: "sample-3",
    path: "sample-3-details",
    colour: "blue",
    textureFamily: "rough",
    measurements: "",
    image: "http://localhost:8000/image-real-file-name.jpg"
  }
];

describe("SampleBasketDialog component", () => {
  beforeEach(() => {
    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(samples));
  });

  it("renders correctly", () => {
    const toggleCart = jest.fn();
    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketDialog
            title="Basket title"
            maximumSamples={3}
            toggleCart={toggleCart}
          />
        </BasketContextProvider>
      </ThemeProvider>
    );
    expect(screen.getByTestId("shopping-cart-dialog")).toBeInTheDocument();
    expect(screen.getAllByTestId("shopping-cart-dialog-product")).toHaveLength(
      3
    );
    expect(screen.getByTestId("shopping-cart-dialog-info")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "MC: pdp.overview.completeSampleOrder"
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "MC: pdp.overview.continueBrowsing"
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "MC: dialog.close" })
    ).toBeInTheDocument();
  });

  it("renders correctly when sample basket is empty", () => {
    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify([]));
    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketDialog title="Basket title" maximumSamples={3} />
        </BasketContextProvider>
      </ThemeProvider>
    );
    expect(screen.getByTestId("shopping-cart-dialog")).toBeInTheDocument();
    expect(
      screen.getByText(`MC: ${microCopy.PDP_OVERVIEW_SAMPLE_DIALOG_MESSAGE}`)
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("shopping-cart-dialog-product")
    ).not.toBeInTheDocument();
  });

  it("should remove sample", () => {
    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketDialog title="Basket title" maximumSamples={3} />
        </BasketContextProvider>
      </ThemeProvider>
    );

    fireEvent.click(
      screen.queryAllByLabelText("MC: pdp.overview.removeSample")[0]
    );

    expect(screen.queryByText("sample-1")).toBeNull();
  });

  it("should navigate to sample order section", () => {
    const basketAction = getClickableActionFromUrl({
      assetUrl: "/no/sample-basket/"
    });

    render(
      <ThemeProvider>
        <SiteContextProvider value={getMockSiteContext()}>
          <BasketContextProvider>
            <SampleBasketDialog
              title="Basket title"
              basketAction={basketAction}
              maximumSamples={3}
            />
          </BasketContextProvider>
        </SiteContextProvider>
      </ThemeProvider>
    );
    expect(
      screen.getByRole("link", { name: "MC: pdp.overview.completeSampleOrder" })
    ).toHaveAttribute("href", "/no/sample-basket/");
  });

  it("should call toggleCart on continue browsing", () => {
    const toggleCart = jest.fn();

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketDialog
            title="Basket title"
            toggleCart={toggleCart}
            maximumSamples={3}
          />
        </BasketContextProvider>
      </ThemeProvider>
    );

    fireEvent.click(screen.queryByText("MC: pdp.overview.continueBrowsing")!);

    expect(toggleCart).toHaveBeenCalledTimes(1);
  });
});
