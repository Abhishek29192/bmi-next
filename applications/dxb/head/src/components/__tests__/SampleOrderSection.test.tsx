import { cleanup, render, screen, waitFor } from "@testing-library/react";
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
    render(
      <SampleOrderSection
        isSampleOrderAllowed={true}
        variant={variant}
      ></SampleOrderSection>,
      {
        wrapper: BasketContextProvider
      }
    );
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
    render(
      <SampleOrderSection
        isSampleOrderAllowed={true}
        variant={variant}
      ></SampleOrderSection>,
      {
        wrapper: BasketContextProvider
      }
    );
    render(
      <SampleOrderSection
        isSampleOrderAllowed={false}
        maximumSamples={3}
      ></SampleOrderSection>,
      {
        wrapper: BasketContextProvider
      }
    );
    expect(screen.queryAllByText(`MC: pdp.overview.removeSample`).length).toBe(
      0
    );
    expect(screen.queryAllByText(`MC: pdp.overview.addSample`).length).toBe(1);
    expect(
      screen.queryAllByText(`MC: pdp.overview.completeSampleOrder`)
    ).not.toBeNull();
  });
});

describe("disable 'Add to basket' if basket is full", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });
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
    render(
      <SampleOrderSection
        isSampleOrderAllowed={true}
        variant={variant1}
      ></SampleOrderSection>,
      {
        wrapper: BasketContextProvider
      }
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    addSampleCta.click();
    render(
      <SampleOrderSection
        isSampleOrderAllowed={true}
        variant={variant2}
      ></SampleOrderSection>,
      {
        wrapper: BasketContextProvider
      }
    );
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
        isSampleOrderAllowed={true}
        variant={variant1}
        maximumSamples={maximumSamples}
      ></SampleOrderSection>,
      {
        wrapper: BasketContextProvider
      }
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    addSampleCta.click();
    render(
      <SampleOrderSection
        isSampleOrderAllowed={true}
        variant={variant2}
        maximumSamples={maximumSamples}
      ></SampleOrderSection>,
      {
        wrapper: BasketContextProvider
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
    render(
      <SampleOrderSection
        isSampleOrderAllowed={true}
        variant={variant1}
      ></SampleOrderSection>,
      {
        wrapper: BasketContextProvider
      }
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    addSampleCta.click();
    render(
      <SampleOrderSection
        isSampleOrderAllowed={true}
        variant={variant2}
      ></SampleOrderSection>,
      {
        wrapper: BasketContextProvider
      }
    );
    const addSampleCtaAgain = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    //maximum sample has reached
    await waitFor(() => {
      addSampleCtaAgain.click();
    });

    //since sample is not available onlyDisplayCompleteOrder is rendered
    render(
      <SampleOrderSection isSampleOrderAllowed={false}></SampleOrderSection>,
      {
        wrapper: BasketContextProvider
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
