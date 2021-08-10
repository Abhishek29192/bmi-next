import { render } from "@testing-library/react";
import React from "react";
import NextBestActions from "../NextBestActions";
import { TagData } from "../Tag";
import { Data as PageInfoData } from "../PageInfo";
import { Data as LinkData } from "../Link";
import { Data as PromoData } from "../Promo";
import { SiteContext } from "../Site";

const getMockSiteContext = (
  countryCode: string = "en",
  nodeLocale: string = "en-GB"
) => ({
  countryCode: countryCode,
  getMicroCopy: (microCopy: string) => `MC: ${microCopy}`,
  node_locale: nodeLocale,
  homePage: {
    title: "Home page title"
  }
});

const testTag1: TagData = { type: "Group", title: "Badgers" };
const card1: PageInfoData = {
  id: "test",
  title: "test",
  __typename: "ContentfulSimplePage",
  slug: "test1",
  path: "/somewhere",
  subtitle: null,
  brandLogo: null,
  featuredMedia: null,
  featuredVideo: null,
  date: "2021-06-01T00:00:00",
  tags: [testTag1]
};

const cta: LinkData = {
  __typename: "ContentfulLink",
  id: "string",
  label: "string",
  icon: null,
  isLabelHidden: null,
  url: "https://www.external.co.uk",
  linkedPage: null,
  type: "External",
  parameters: null,
  dialogContent: null,
  hubSpotCTAID: null
};

const card2: PromoData = {
  __typename: "ContentfulPromo",
  id: "testId",
  name: "test",
  title: "test",
  subtitle: "I am a subtitle",
  body: null,
  tags: null,
  brandLogo: null,
  featuredMedia: null,
  featuredVideo: null,
  cta,
  backgroundColor: null
};

describe("NextBestActions component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <SiteContext.Provider value={getMockSiteContext()}>
        <NextBestActions data={[card1, card2]} />
      </SiteContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with no promo cta", () => {
    const { container } = render(
      <SiteContext.Provider value={getMockSiteContext()}>
        <NextBestActions data={[{ ...card2, cta: null }]} />
      </SiteContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with no promo cta label", () => {
    const { container } = render(
      <SiteContext.Provider value={getMockSiteContext()}>
        <NextBestActions data={[{ ...card2, cta: { ...cta, label: null } }]} />
      </SiteContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });
});
