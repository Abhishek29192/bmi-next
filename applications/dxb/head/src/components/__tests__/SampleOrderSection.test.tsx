import { render, screen } from "@testing-library/react";
import React from "react";
import SampleOrderSection from "../SampleOrderSection";
import { BasketContextProvider } from "../../contexts/SampleBasketContext";

describe("Functionality of sample basket", () => {
  it("'remove from basket' & 'complete sample order' cta is displayed if add to basket cta is clicked and vice versa ", () => {
    const variant = {
      code: "somthing",
      path: null,
      breadcrumbs: null,
      approvalStatus: null,
      images: null,
      isSampleOrderAllowed: null,
      longDescription: null,
      shortDescription: null
    };
    render(<SampleOrderSection variant={variant}></SampleOrderSection>, {
      wrapper: BasketContextProvider
    });
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    addSampleCta.click();
    expect(screen.queryByText(`MC: pdp.overview.removeSample`)).not.toBeNull();
    expect(
      screen.queryByText("MC: pdp.overview.completeSampleOrder")
    ).not.toBeNull();
    const removeSample = screen.getByRole("button", {
      name: `MC: pdp.overview.removeSample`
    });
    removeSample.click();
    expect(screen.queryByText(`MC: pdp.overview.removeSample`)).toBeNull();
    expect(screen.queryByText(`MC: pdp.overview.addSample`)).not.toBeNull();
    expect(
      screen.queryByText(`MC: pdp.overview.completeSampleOrder`)
    ).toBeNull();
  });
  it("display only complete order if there are some items on basket but sample is not allowed", () => {
    const { container } = render(
      <SampleOrderSection onlyDisplayCompleteOrder={true}></SampleOrderSection>,
      {
        wrapper: BasketContextProvider
      }
    );
    expect(
      container.getElementsByClassName(
        "buttons-container-complete-sample-order-only"
      ).length
    ).toBe(1);
  });
});
