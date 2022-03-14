import { ThemeProvider } from "@bmi/components";
import { render } from "@testing-library/react";
import React from "react";
import { Data as LinkData, DataTypeEnum } from "../Link";
import NextBestActions from "../NextBestActions";
import { Data as PageInfoData } from "../PageInfo";
import { Data as PromoData } from "../Promo";
import { SiteContextProvider } from "../Site";
import { TagData } from "../Tag";
import { getMockSiteContext } from "./utils/SiteContextProvider";

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
  type: DataTypeEnum.External,
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

const card3: PromoData = {
  __typename: "ContentfulPromo",
  id: "testId",
  name: "test name",
  title: null,
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
      <ThemeProvider>
        <SiteContextProvider value={getMockSiteContext()}>
          <NextBestActions data={[card1, card2]} />
        </SiteContextProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with no promo cta", () => {
    const { container } = render(
      <ThemeProvider>
        <SiteContextProvider value={getMockSiteContext()}>
          <NextBestActions data={[{ ...card2, cta: null }]} />
        </SiteContextProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders with no promo cta label", () => {
    const { container } = render(
      <ThemeProvider>
        <SiteContextProvider value={getMockSiteContext()}>
          <NextBestActions
            data={[{ ...card2, cta: { ...cta, label: null } }]}
          />
        </SiteContextProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders name with no title", () => {
    const { container } = render(
      <ThemeProvider>
        <SiteContextProvider value={getMockSiteContext()}>
          <NextBestActions data={[card3]} />
        </SiteContextProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
