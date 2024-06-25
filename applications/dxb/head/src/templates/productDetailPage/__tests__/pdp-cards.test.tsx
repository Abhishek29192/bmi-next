import ThemeProvider from "@bmi-digital/components/theme-provider";
import { render } from "@testing-library/react";
import React from "react";
import { createMockSiteData } from "../../../test/mockSiteData";
import PdpCardsSection from "../components/pdp-cards";
import createVideoData from "../../../__tests__/helpers/VideoHelper";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import { createInternalLinkData } from "../../../__tests__/helpers/LinkHelper";

const { countryCode } = createMockSiteData();
const pdpCardsTitle = "example-pdp-cards-title";

describe("PdpCardsSection", () => {
  it("renders the video component when a featuredVideo is defined (Promo Data)", () => {
    const { baseElement } = render(
      <ThemeProvider>
        <PdpCardsSection
          resources={{
            pdpCards: [
              {
                title: "Promo Card with Video",
                featuredMedia: createImageData(),
                featuredVideo: createVideoData(),
                path: "promo-video/"
              }
            ],
            pdpCardsTitle: pdpCardsTitle
          }}
          countryCode={countryCode}
        />
      </ThemeProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("renders the image component when a featuredImage is defined and featuredVideo is null (PageInfo Data)", () => {
    const { baseElement } = render(
      <ThemeProvider>
        <PdpCardsSection
          resources={{
            pdpCards: [
              {
                title: "PageInfo Card with Image",
                featuredMedia: createImageData(),
                featuredVideo: null,
                cta: createInternalLinkData()
              }
            ],
            pdpCardsTitle: pdpCardsTitle
          }}
          countryCode={countryCode}
        />
      </ThemeProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });

  it("renders the default image component when neither a featuredVideo nor a featuredImage is defined (PageInfo Data)", () => {
    const { baseElement } = render(
      <ThemeProvider>
        <PdpCardsSection
          resources={{
            pdpCards: [
              {
                title: "PageInfo Card with Image",
                featuredMedia: null,
                featuredVideo: null,
                cta: createInternalLinkData()
              }
            ],
            pdpCardsTitle: pdpCardsTitle
          }}
          countryCode={countryCode}
        />
      </ThemeProvider>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
