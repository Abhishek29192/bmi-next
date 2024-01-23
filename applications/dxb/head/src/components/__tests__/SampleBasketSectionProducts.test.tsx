import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { GoodBetterBest } from "@bmi/pim-types";
import { BasketContextProvider } from "../../contexts/SampleBasketContext";
import { local } from "../../utils/storage";
import SampleBasketSectionProducts from "../SampleBasketSectionProducts";
import createSampleData from "../../__tests__/helpers/SampleHelper";
import { renderWithProviders } from "../../__tests__/renderWithProviders";

describe("SampleBasketSectionProducts component", () => {
  it("should render the tag component if goodBetterBest is defined", () => {
    const sampleData = [
      createSampleData({ goodBetterBest: GoodBetterBest.best })
    ];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );
    expect(screen.getByTestId("tag-indicator-best")).toBeInTheDocument();
    expect(screen.getByTestId("tag-icon-best")).toBeInTheDocument();
    expect(
      screen.getByText("MC: goodBetterBest.label.best")
    ).toBeInTheDocument();
  });

  it("should not render the tag component if goodBetterBest is undefined", () => {
    const sampleData = [createSampleData()];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );
    expect(screen.queryByTestId("tag-indicator-best")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("tag-indicator-better")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("tag-indicator-good")).not.toBeInTheDocument();
  });

  it("should set the ctaLabel to the pdp overview remove sample microcopy text", () => {
    const sampleData = [createSampleData()];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );
    expect(
      screen.getByText("MC: pdp.overview.removeSample")
    ).toBeInTheDocument();
  });

  it("should attach the href attribute to the product sample card using the path prop", () => {
    const sampleData = [createSampleData()];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    renderWithProviders(
      <BasketContextProvider>
        <SampleBasketSectionProducts />
      </BasketContextProvider>
    );
    expect(
      screen.getByTestId("shopping-cart-product-sample-1")
    ).toHaveAttribute("href", "/no/sample-1-path/");
  });

  it("should always render the image component even if the image prop is undefined", () => {
    const sampleData = [createSampleData()];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", sampleData[0].name);
    expect(image).not.toHaveAttribute("src");
  });

  it("should apply the image prop value to the image src attribute if defined", () => {
    const sampleData = [createSampleData({ image: "image/of/tile/url" })];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", sampleData[0].name);
    expect(image).toHaveAttribute("src", "image/of/tile/url");
  });

  it("should render the measurements description if defined", () => {
    const sampleData = [
      createSampleData({ measurements: "some descriptive measurement text" })
    ];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );

    expect(
      screen.getByTestId("tappable-card-body-description")
    ).toHaveTextContent("some descriptive measurement text");
  });

  it("should not render the measurements description if undefined", () => {
    const sampleData = [createSampleData({ measurements: undefined })];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("tappable-card-body-description")
    ).not.toBeInTheDocument();
  });

  it("should render the subtitle correctly if both colour and textureFamily are defined", () => {
    const sampleData = [
      createSampleData({ colour: "Black", textureFamily: "Metal" })
    ];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId("tappable-card-body-subtitle")).toHaveTextContent(
      /^Black \| Metal$/
    );
  });

  it("should render the subtitle correctly if colour is defined and textureFamily is undefined", () => {
    const sampleData = [
      createSampleData({ colour: "Black", textureFamily: "Metal" })
    ];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId("tappable-card-body-subtitle")).toHaveTextContent(
      /^Black/
    );
  });

  it("should render the subtitle correctly if colour is undefined and textureFamily is defined", () => {
    const sampleData = [
      createSampleData({ colour: "Black", textureFamily: "Metal" })
    ];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId("tappable-card-body-subtitle")).toHaveTextContent(
      /Metal$/
    );
  });

  it("should not render the subtitle component if colour and metal are both undefined", () => {
    const sampleData = [createSampleData()];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("tappable-card-body-subtitle")
    ).not.toBeInTheDocument();
  });

  it("should render the title using the name prop value", () => {
    const sampleData = [createSampleData()];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );

    expect(screen.getByTestId("tappable-card-body-title")).toHaveTextContent(
      sampleData[0].name
    );
  });

  it("should render all samples in the basket", () => {
    const sampleData = [
      createSampleData(),
      createSampleData({ name: "sample-2" }),
      createSampleData({ name: "sample-3" })
    ];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );

    expect(
      screen.getByTestId("shopping-cart-product-sample-1")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("shopping-cart-product-sample-2")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("shopping-cart-product-sample-3")
    ).toBeInTheDocument();
  });

  it("should remove the correct sample from the basket if the remove sample button is clicked (local storage)", async () => {
    const sampleData = [
      createSampleData(),
      createSampleData({
        name: "sample-2",
        code: "sample-2-code",
        path: "sample-2-path"
      }),
      createSampleData({
        name: "sample-3",
        code: "sample-3-code",
        path: "sample-3-path"
      })
    ];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    renderWithProviders(
      <BasketContextProvider>
        <SampleBasketSectionProducts />
      </BasketContextProvider>
    );

    const setItemSpy = jest.spyOn(local, "setItem");
    fireEvent.click(
      screen.getAllByRole("button", {
        name: "MC: pdp.overview.removeSample"
      })[0]
    );

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(
        `no-basketItems`,
        JSON.stringify([sampleData[1], sampleData[2]])
      );
    });

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "MC: pdp.overview.removeSample"
      })[0]
    );

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(
        `no-basketItems`,
        JSON.stringify([sampleData[2]])
      );
    });

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "MC: pdp.overview.removeSample"
      })[0]
    );

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith(
        `no-basketItems`,
        JSON.stringify([])
      );
    });
  });

  // This test is deliberately skipped because the modal closes upon removal of
  // a sample. This should be tested manually in QA if changes are made to the
  // sample basket.
  it.skip("should remove the correct sample from the basket if the remove sample button is clicked (DOM)", () => {
    const sampleData = [
      createSampleData(),
      createSampleData({
        name: "sample-2",
        code: "sample-2-code",
        path: "sample-2-path"
      }),
      createSampleData({
        name: "sample-3",
        code: "sample-3-code",
        path: "sample-3-path"
      })
    ];

    jest.spyOn(local, "getItem").mockReturnValue(JSON.stringify(sampleData));

    render(
      <ThemeProvider>
        <BasketContextProvider>
          <SampleBasketSectionProducts />
        </BasketContextProvider>
      </ThemeProvider>
    );

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "MC: pdp.overview.removeSample"
      })[0]
    );

    expect(
      screen.queryByTestId("shopping-cart-product-sample-1")
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("shopping-cart-product-sample-2")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("shopping-cart-product-sample-3")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "MC: pdp.overview.removeSample"
      })[0]
    );

    expect(
      screen.queryByTestId("shopping-cart-product-sample-1")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("shopping-cart-product-sample-2")
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("shopping-cart-product-sample-3")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "MC: pdp.overview.removeSample"
      })[0]
    );

    expect(
      screen.queryByTestId("shopping-cart-product-sample-1")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("shopping-cart-product-sample-2")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("shopping-cart-product-sample-3")
    ).not.toBeInTheDocument();
  });
});
