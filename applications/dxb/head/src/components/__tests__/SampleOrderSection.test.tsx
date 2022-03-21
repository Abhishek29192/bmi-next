import { cleanup, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import SampleOrderSection from "../SampleOrderSection";
import { BasketContextProvider } from "../../contexts/SampleBasketContext";
import { Data as PageInfoData } from "../PageInfo";
import { SiteContextProvider } from "../Site";
import { Product } from "../types/pim";
import { createVariantOption } from "../../__tests__/PimDocumentProductHelper";
import { getMockSiteContext } from "./utils/SiteContextProvider";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const sampleBasketLinkInfo: PageInfoData = {
  id: "test",
  title: "test",
  __typename: "ContentfulSimplePage",
  slug: "sample-basket",
  path: "sample-basket/",
  subtitle: null,
  brandLogo: null,
  featuredMedia: null,
  featuredVideo: null,
  date: null,
  tags: null
};
const variant = createVariantOption({
  code: "somthing"
});
const variant2 = { ...variant, code: "variant2" };

const product: Product = {
  code: "product",
  documents: null,
  isSampleOrderAllowed: null,
  longDescription: null,
  shortDescription: null,
  description: null,
  name: "product",
  summary: null
};

describe("Functionality of sample basket", () => {
  it("'remove from basket' & 'complete sample order' cta is displayed if add to basket cta is clicked and vice versa ", async () => {
    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        <SampleOrderSection
          isSampleOrderAllowed={true}
          variant={variant}
          product={product}
          sampleBasketLinkInfo={sampleBasketLinkInfo}
        ></SampleOrderSection>
      </SiteContextProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    await waitFor(() => {
      addSampleCta.click();
    });
    expect(screen.queryByText(`MC: pdp.overview.removeSample`)).not.toBeNull();
    expect(
      screen.queryByText("MC: pdp.overview.completeSampleOrder")
    ).not.toBeNull();
    const removeSample = screen.getByRole("button", {
      name: `MC: pdp.overview.removeSample`
    });
    await waitFor(() => {
      removeSample.click();
    });

    expect(screen.queryByText(`MC: pdp.overview.removeSample`)).toBeNull();
    expect(screen.queryByText(`MC: pdp.overview.addSample`)).not.toBeNull();
    expect(
      screen.queryByText(`MC: pdp.overview.completeSampleOrder`)
    ).toBeNull();
  });
  it("display only complete order if there are some items on basket but sample is not allowed", () => {
    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        <SampleOrderSection
          isSampleOrderAllowed={true}
          variant={variant}
          sampleBasketLinkInfo={sampleBasketLinkInfo}
          product={product}
        ></SampleOrderSection>
      </SiteContextProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        <SampleOrderSection
          isSampleOrderAllowed={false}
          maximumSamples={3}
          sampleBasketLinkInfo={sampleBasketLinkInfo}
          product={product}
        ></SampleOrderSection>
      </SiteContextProvider>,
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
  it("not ordered max samples & sample available, show MC:canAddMoreMessage ", async () => {
    const maximumSamples = 3;
    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        <SampleOrderSection
          isSampleOrderAllowed={true}
          variant={variant}
          sampleBasketLinkInfo={sampleBasketLinkInfo}
          product={product}
        ></SampleOrderSection>
      </SiteContextProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    addSampleCta.click();
    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        <BasketContextProvider>
          <SampleOrderSection
            isSampleOrderAllowed={true}
            variant={variant2}
            sampleBasketLinkInfo={sampleBasketLinkInfo}
            product={product}
          />
        </BasketContextProvider>
      </SiteContextProvider>
    );
    const addSampleCtaAgain = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    //maximum sample has reached
    await waitFor(() => {
      addSampleCtaAgain.click();
    });
    // check maximum sample has reached
    expect(
      JSON.parse(localStorage.getItem("no-basketItems")).length
    ).toBeLessThan(maximumSamples);
    // get the message
    const canAddMoreMessage = screen.queryAllByText(
      "MC: pdp.overview.canAddMoreMessage"
    );
    expect(canAddMoreMessage).not.toBeNull();
  });

  it("ordered max samples then display MC:sampleLimitReachedMessage", async () => {
    //set max samples to 2
    const maximumSamples = 2;
    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        <BasketContextProvider>
          <SampleOrderSection
            isSampleOrderAllowed={true}
            variant={variant}
            maximumSamples={maximumSamples}
            sampleBasketLinkInfo={sampleBasketLinkInfo}
            product={product}
          />
        </BasketContextProvider>
      </SiteContextProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    addSampleCta.click();
    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        <BasketContextProvider>
          <SampleOrderSection
            isSampleOrderAllowed={true}
            variant={variant2}
            maximumSamples={maximumSamples}
            sampleBasketLinkInfo={sampleBasketLinkInfo}
            product={product}
          />
        </BasketContextProvider>
      </SiteContextProvider>
    );
    const addSampleCtaAgain = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    //maximum sample has reached
    await waitFor(() => {
      addSampleCtaAgain.click();
    });
    //check maximum sample has reached
    expect(JSON.parse(localStorage.getItem("no-basketItems")).length).toBe(
      maximumSamples
    );
    const sampleLimitReachedMessage = screen.queryByText(
      "MC: pdp.overview.sampleLimitReachedMessage"
    );
    expect(sampleLimitReachedMessage).not.toBeNull();
  });
  it("not ordered max samples & sample unavailable, show MC: canAddOtherMessage", async () => {
    const maximumSamples = 4;
    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        <BasketContextProvider>
          <SampleOrderSection
            isSampleOrderAllowed={true}
            variant={variant}
            sampleBasketLinkInfo={sampleBasketLinkInfo}
            product={product}
          />
        </BasketContextProvider>
      </SiteContextProvider>
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    addSampleCta.click();
    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        <BasketContextProvider>
          <SampleOrderSection
            isSampleOrderAllowed={true}
            variant={variant2}
            sampleBasketLinkInfo={sampleBasketLinkInfo}
            product={product}
          />
        </BasketContextProvider>
      </SiteContextProvider>
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
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        <BasketContextProvider>
          <SampleOrderSection
            isSampleOrderAllowed={false}
            sampleBasketLinkInfo={sampleBasketLinkInfo}
            product={product}
          />
        </BasketContextProvider>
      </SiteContextProvider>
    );
    //check the localStorage is not full for basketItems
    expect(
      JSON.parse(localStorage.getItem("no-basketItems")).length
    ).toBeLessThan(maximumSamples);
    //get the message
    const canAddOtherMessage = screen.queryByText(
      "MC: pdp.overview.canAddOtherMessage"
    );
    expect(canAddOtherMessage).not.toBeNull();
  });
});

describe("Test Functionality of redirections by click on 'Complete order' ", () => {
  it("do not add product is it is already in state", () => {
    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        <SampleOrderSection
          isSampleOrderAllowed={true}
          variant={variant}
          product={product}
          sampleBasketLinkInfo={sampleBasketLinkInfo}
        ></SampleOrderSection>
      </SiteContextProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    localStorage.setItem("basketItems", JSON.stringify(variant));
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    addSampleCta.click();
    expect(JSON.parse(localStorage.getItem("basketItems"))).toEqual(variant);
  });
  it("add redirect url to 'Complete order' CTA", async () => {
    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext(),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        <SampleOrderSection
          isSampleOrderAllowed={true}
          variant={variant}
          product={product}
          sampleBasketLinkInfo={sampleBasketLinkInfo}
        ></SampleOrderSection>
      </SiteContextProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    await waitFor(() => {
      addSampleCta.click();
    });
    const completeOrderCta = screen.getByRole("button", {
      name: `MC: pdp.overview.completeSampleOrder`
    });

    expect(completeOrderCta).toHaveAttribute("href", "/en/sample-basket/");
  });
  it("should not to be rendered Complete order' CTA if no sampleBasketLinkInfo", () => {
    render(
      <SiteContextProvider
        value={{
          ...getMockSiteContext("no"),
          reCaptchaKey: "1234",
          reCaptchaNet: false
        }}
      >
        <SampleOrderSection
          isSampleOrderAllowed={true}
          variant={variant}
          product={product}
          sampleBasketLinkInfo={null}
        ></SampleOrderSection>
      </SiteContextProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    expect(
      screen.queryAllByAltText(`MC: pdp.overview.completeSampleOrder`)
    ).toHaveLength(0);
  });
});
