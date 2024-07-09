import React from "react";
import { screen } from "@testing-library/react";
import { microCopy } from "@bmi/microcopies";
import SyndicateSection, { Data } from "../SyndicateSection";
import { renderWithProviders } from "../../__tests__/renderWithProviders";
import createPromoData from "../../__tests__/helpers/PromoHelper";
import createPageInfoData from "../../__tests__/helpers/PageInfoHelper";

const createSyndicateSectionData = (
  syndicateSectionData?: Partial<Data>
): Data => ({
  __typename: "ContentfulSyndicateSection",
  title: "Hello",
  description: {
    description: "Coconuts have water in them"
  },
  isReversed: false,
  villains: null,
  ...syndicateSectionData
});

describe("SyndicateSection", () => {
  it("should render description if provided", () => {
    const data = createSyndicateSectionData();
    renderWithProviders(<SyndicateSection data={data} position={1} />);
    expect(
      screen.getByTestId("syndicate-section-description")
    ).toHaveTextContent(data.description!.description);
  });

  it("should not render description if not provided", () => {
    const data = createSyndicateSectionData({
      description: null
    });
    renderWithProviders(<SyndicateSection data={data} position={1} />);
    expect(
      screen.queryByTestId("syndicate-section-description")
    ).not.toBeInTheDocument();
  });

  it("renders the CTA for a promo", () => {
    const promo = createPromoData();
    const data = createSyndicateSectionData({ villains: [promo] });
    renderWithProviders(<SyndicateSection data={data} position={1} />);
    expect(
      screen.getByRole("link", { name: promo.cta!.label })
    ).toBeInTheDocument();
  });

  it("renders the CTA for page info", () => {
    const pageInfo = createPageInfoData({ path: "/page-info" });
    const data = createSyndicateSectionData({ villains: [pageInfo] });
    renderWithProviders(<SyndicateSection data={data} position={1} />);
    expect(
      screen.getByRole("link", { name: `MC: ${microCopy.PAGE_LINK_LABEL}` })
    ).toBeInTheDocument();
  });
});
