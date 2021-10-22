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
    render(<SampleOrderSection productName="" variant={variant} />, {
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
      <SampleOrderSection productName="" onlyDisplayCompleteOrder={true} />,
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

describe("disable 'Add to basket' if basket is full", () => {
  it("not ordered max samples & sample available, show MC:canAddMoreMessage ", async () => {
    const maximumSamples = 3;
    const variant1 = {
      code: "variant1",
      path: null,
      breadcrumbs: null,
      approvalStatus: null,
      images: null,
      isSampleOrderAllowed: true,
      longDescription: null,
      shortDescription: null
    };
    const variant2 = { ...variant1, code: "variant2" };
    render(<SampleOrderSection variant={variant1}></SampleOrderSection>, {
      wrapper: BasketContextProviderForTest
    });
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    addSampleCta.click();
    render(<SampleOrderSection variant={variant2}></SampleOrderSection>, {
      wrapper: BasketContextProviderForTest
    });
    const addSampleCtaAgain = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    //maximum sample has reached
    await waitFor(() => {
      addSampleCtaAgain.click();
    });
    // check maximum sample has reached
    expect(JSON.parse(localStorage.getItem("basketItems")).length).toBeLessThan(
      maximumSamples
    );
    // get the message
    const canAddMoreMessage = screen.queryAllByText(
      "MC: pdp.overview.canAddMoreMessage"
    );
    expect(canAddMoreMessage).not.toBeNull();
  });

  it("ordered max samples then display MC:sampleLimitReachedMessage", async () => {
    //set max samples to 2

    const maximumSamples = 2;
    const variant1 = {
      code: "variant1",
      path: null,
      breadcrumbs: null,
      approvalStatus: null,
      images: null,
      isSampleOrderAllowed: true,
      longDescription: null,
      shortDescription: null
    };
    const variant2 = { ...variant1, code: "variant2" };
    render(
      <SampleOrderSection
        variant={variant1}
        maximumSamples={maximumSamples}
      ></SampleOrderSection>,
      {
        wrapper: BasketContextProviderForTest
      }
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    addSampleCta.click();
    render(
      <SampleOrderSection
        variant={variant2}
        maximumSamples={maximumSamples}
      ></SampleOrderSection>,
      {
        wrapper: BasketContextProviderForTest
      }
    );
    const addSampleCtaAgain = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    //maximum sample has reached
    await waitFor(() => {
      addSampleCtaAgain.click();
    });
    //check maximum sample has reached
    expect(JSON.parse(localStorage.getItem("basketItems")).length).toBe(
      maximumSamples
    );
    const sampleLimitReachedMessage = screen.queryByText(
      "MC: pdp.overview.sampleLimitReachedMessage"
    );
    expect(sampleLimitReachedMessage).not.toBeNull();
  });
  it("not ordered max samples & sample unavailable, show MC: canAddOtherMessage", async () => {
    const maximumSamples = 4;
    const variant1 = {
      code: "variant1",
      path: null,
      breadcrumbs: null,
      approvalStatus: null,
      images: null,
      isSampleOrderAllowed: true,
      longDescription: null,
      shortDescription: null
    };
    const variant2 = { ...variant1, code: "variant2" };
    render(<SampleOrderSection variant={variant1}></SampleOrderSection>, {
      wrapper: BasketContextProviderForTest
    });
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    addSampleCta.click();
    render(<SampleOrderSection variant={variant2}></SampleOrderSection>, {
      wrapper: BasketContextProviderForTest
    });
    const addSampleCtaAgain = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    //maximum sample has reached
    await waitFor(() => {
      addSampleCtaAgain.click();
    });

    //since sample is not available onlyDisplayCompleteOrder is rendered
    render(
      <SampleOrderSection onlyDisplayCompleteOrder={true}></SampleOrderSection>,
      {
        wrapper: BasketContextProviderForTest
      }
    );
    //check the localStorage is not full for basketItems
    expect(JSON.parse(localStorage.getItem("basketItems")).length).toBeLessThan(
      maximumSamples
    );
    //get the message
    const canAddOtherMessage = screen.queryByText(
      "MC: pdp.overview.canAddOtherMessage"
    );
    expect(canAddOtherMessage).not.toBeNull();
  });
});
