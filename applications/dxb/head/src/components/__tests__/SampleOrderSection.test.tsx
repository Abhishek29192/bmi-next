import { ThemeProvider } from "@bmi-digital/components";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BasketContextProvider } from "../../contexts/SampleBasketContext";
import { Product } from "../../types/pim";
import createProduct from "../../__tests__/helpers/ProductHelper";
import { Data as PageInfoData } from "../PageInfo";
import SampleOrderSection from "../SampleOrderSection";
import { SiteContextProvider } from "../Site";
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

const product: Product = createProduct({
  hashedCode: "id-1",
  code: "product-1",
  name: "product-1"
});
const product2: Product = createProduct({
  hashedCode: "id-2",
  code: "product-2",
  name: "product-2"
});

describe("Functionality of sample basket", () => {
  it("'remove from basket' & 'complete sample order' cta is displayed if add to basket cta is clicked and vice versa ", async () => {
    render(
      <ThemeProvider>
        <SiteContextProvider
          value={{
            ...getMockSiteContext("no"),
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          <SampleOrderSection
            isSampleOrderAllowed={true}
            product={product}
            sampleBasketLinkInfo={sampleBasketLinkInfo}
          ></SampleOrderSection>
        </SiteContextProvider>
      </ThemeProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    fireEvent.click(addSampleCta);
    expect(screen.getByText(`MC: pdp.overview.removeSample`)).not.toBeNull();
    expect(
      screen.getByText("MC: pdp.overview.completeSampleOrder")
    ).not.toBeNull();
    const removeSample = screen.getByRole("button", {
      name: `MC: pdp.overview.removeSample`
    });
    fireEvent.click(removeSample);

    expect(screen.queryByText(`MC: pdp.overview.removeSample`)).toBeNull();
    expect(screen.getByText(`MC: pdp.overview.addSample`)).not.toBeNull();
    expect(
      screen.queryByText(`MC: pdp.overview.completeSampleOrder`)
    ).toBeNull();
  });

  it("display only complete order if there are some items on basket but sample is not allowed", () => {
    localStorage.setItem("-basketItems", JSON.stringify([product2]));
    render(
      <ThemeProvider>
        <SiteContextProvider
          value={{
            ...getMockSiteContext("no"),
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          <SampleOrderSection
            isSampleOrderAllowed={false}
            sampleBasketLinkInfo={sampleBasketLinkInfo}
            product={product}
          ></SampleOrderSection>
        </SiteContextProvider>
      </ThemeProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    expect(
      screen.queryByText(`MC: pdp.overview.removeSample`)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(`MC: pdp.overview.addSample`)
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(`MC: pdp.overview.completeSampleOrder`)
    ).toBeInTheDocument();
  });
});

describe("disable 'Add to basket' if basket is full", () => {
  it("not ordered max samples & sample available, show MC:canAddMoreMessage ", async () => {
    const maximumSamples = 3;
    render(
      <ThemeProvider>
        <SiteContextProvider
          value={{
            ...getMockSiteContext("no"),
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          <SampleOrderSection
            isSampleOrderAllowed={true}
            sampleBasketLinkInfo={sampleBasketLinkInfo}
            product={product}
          ></SampleOrderSection>
        </SiteContextProvider>
      </ThemeProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    fireEvent.click(addSampleCta);
    render(
      <ThemeProvider>
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
              sampleBasketLinkInfo={sampleBasketLinkInfo}
              product={product2}
            />
          </BasketContextProvider>
        </SiteContextProvider>
      </ThemeProvider>
    );
    const addSampleCtaAgain = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    //maximum sample has reached
    fireEvent.click(addSampleCtaAgain);
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
      <ThemeProvider>
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
              maximumSamples={maximumSamples}
              sampleBasketLinkInfo={sampleBasketLinkInfo}
              product={product}
            />
          </BasketContextProvider>
        </SiteContextProvider>
      </ThemeProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    fireEvent.click(addSampleCta);
    await render(
      <ThemeProvider>
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
              maximumSamples={maximumSamples}
              sampleBasketLinkInfo={sampleBasketLinkInfo}
              product={product2}
            />
          </BasketContextProvider>
        </SiteContextProvider>
      </ThemeProvider>
    );
    const addSampleCtaAgain = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    //maximum sample has reached
    fireEvent.click(addSampleCtaAgain);
    //check maximum sample has reached
    expect(JSON.parse(localStorage.getItem("no-basketItems")).length).toBe(
      maximumSamples
    );
    const sampleLimitReachedMessage = screen.getByText(
      "MC: pdp.overview.sampleLimitReachedMessage"
    );
    expect(sampleLimitReachedMessage).not.toBeNull();
  });

  it("not ordered max samples & sample unavailable, show MC: canAddOtherMessage", async () => {
    const maximumSamples = 4;
    await render(
      <ThemeProvider>
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
              sampleBasketLinkInfo={sampleBasketLinkInfo}
              product={product}
            />
          </BasketContextProvider>
        </SiteContextProvider>
      </ThemeProvider>
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    fireEvent.click(addSampleCta);
    await render(
      <ThemeProvider>
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
              sampleBasketLinkInfo={sampleBasketLinkInfo}
              product={product2}
            />
          </BasketContextProvider>
        </SiteContextProvider>
      </ThemeProvider>
    );
    const addSampleCtaAgain = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    //maximum sample has reached
    fireEvent.click(addSampleCtaAgain);

    //since sample is not available onlyDisplayCompleteOrder is rendered
    render(
      <ThemeProvider>
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
      </ThemeProvider>
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
      <ThemeProvider>
        <SiteContextProvider
          value={{
            ...getMockSiteContext("no"),
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          <SampleOrderSection
            isSampleOrderAllowed={true}
            product={product}
            sampleBasketLinkInfo={sampleBasketLinkInfo}
          ></SampleOrderSection>
        </SiteContextProvider>
      </ThemeProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    localStorage.setItem("basketItems", JSON.stringify(product));
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    fireEvent.click(addSampleCta);
    expect(JSON.parse(localStorage.getItem("basketItems"))).toEqual(product);
  });
  it("add redirect url to 'Complete order' CTA", async () => {
    render(
      <ThemeProvider>
        <SiteContextProvider
          value={{
            ...getMockSiteContext(),
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          <SampleOrderSection
            isSampleOrderAllowed={true}
            product={product}
            sampleBasketLinkInfo={sampleBasketLinkInfo}
          ></SampleOrderSection>
        </SiteContextProvider>
      </ThemeProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    const addSampleCta = screen.getByRole("button", {
      name: `MC: pdp.overview.addSample`
    });
    fireEvent.click(addSampleCta);
    const completeOrderCta = screen.getByText(
      "MC: pdp.overview.completeSampleOrder"
    );

    expect(completeOrderCta).toHaveAttribute("href", "/en/sample-basket/");
  });
  it("should not to be rendered Complete order' CTA if no sampleBasketLinkInfo", () => {
    render(
      <ThemeProvider>
        <SiteContextProvider
          value={{
            ...getMockSiteContext("no"),
            reCaptchaKey: "1234",
            reCaptchaNet: false
          }}
        >
          <SampleOrderSection
            isSampleOrderAllowed={true}
            product={product}
            sampleBasketLinkInfo={null}
          ></SampleOrderSection>
        </SiteContextProvider>
      </ThemeProvider>,
      {
        wrapper: BasketContextProvider
      }
    );
    expect(
      screen.queryAllByAltText(`MC: pdp.overview.completeSampleOrder`)
    ).toHaveLength(0);
  });
});
