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

const getSiteContext = () => ({
  countryCode: "en",
  getMicroCopy: (microCopy: string) => `MC: ${microCopy}`,
  node_locale: "en-GB",
  homePage: {
    title: "Home page title"
  }
});

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
    const { container, queryByRole } = render(
      <BasketContextProvider>
        <SampleBasketDialog title="Basket title" />
      </BasketContextProvider>
    );
    expect(
      container.getElementsByClassName("cart-drawer")[0]
    ).toBeInTheDocument();
    expect(container.getElementsByClassName("row").length).toBe(3);
    expect(
      container.getElementsByClassName("cart-info")[0]
    ).toBeInTheDocument();
    expect(
      queryByRole("button", { name: "MC: pdp.overview.completeSampleOrder" })
    ).toBeInTheDocument();
    expect(
      queryByRole("button", { name: "MC: pdp.overview.continueBrowsing" })
    ).toBeInTheDocument();
    expect(
      queryByRole("button", { name: "MC: dialog.close" })
    ).toBeInTheDocument();
  });
  it("renders correctly when sample basket is empty", () => {
    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify([]));
    const { container } = render(
      <BasketContextProvider>
        <SampleBasketDialog title="Basket title" />
      </BasketContextProvider>
    );
    expect(container.querySelector(".cart-drawer")).not.toBeInTheDocument();
  });

  it("should remove sample", () => {
    render(
      <BasketContextProvider>
        <SampleBasketDialog title="Basket title" />
      </BasketContextProvider>
    );

    fireEvent.click(
      screen.queryAllByLabelText("MC: pdp.overview.removeSample")[0]
    );

    expect(screen.queryByText("sample-1")).toBeNull();
  });

  it("should navigate to sample order section", () => {
    const basketAction = getClickableActionFromUrl(
      null,
      null,
      null,
      `/no/sample-basket/`
    );

    const { getByRole } = render(
      <SiteContextProvider value={getSiteContext()}>
        <BasketContextProvider>
          <SampleBasketDialog
            title="Basket title"
            basketAction={basketAction}
          />
        </BasketContextProvider>
      </SiteContextProvider>
    );
    expect(
      getByRole("link", { name: "MC: pdp.overview.completeSampleOrder" })
    ).toHaveAttribute("href", "/no/sample-basket/");
  });
  it("should call toggleCart on continue browsing", () => {
    const toggleCart = jest.fn();

    render(
      <BasketContextProvider>
        <SampleBasketDialog title="Basket title" toggleCart={toggleCart} />
      </BasketContextProvider>
    );

    fireEvent.click(screen.queryByText("MC: pdp.overview.continueBrowsing"));

    expect(toggleCart).toHaveBeenCalledTimes(1);
  });
});
