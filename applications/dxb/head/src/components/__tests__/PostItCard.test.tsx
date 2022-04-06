import React from "react";
import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostItCard, {
  Props as PostItCradProps,
  Data as SectionProps
} from "../../components/PostItCard";
import { Data as LinkProps } from "../../components/Link";

describe("PostItCard", () => {
  const linkData: LinkProps = {
    __typename: "ContentfulLink",
    id: "link_id",
    label: "Link Label",
    icon: null,
    isLabelHidden: null,
    type: null,
    url: "https://mocked_link",
    parameters: null,
    dialogContent: null,
    linkedPage: null,
    hubSpotCTAID: null
  };

  const linkSectionData: SectionProps = {
    id: "link-section-id",
    title: "Link Section",
    hasUnderline: false,
    description: { description: "Link section description" },
    link: { ...linkData, label: "Link section label" },
    linkType: "link"
  };

  const buttonSectionData: SectionProps = {
    id: "button-section-id",
    title: "Button Section",
    hasUnderline: false,
    description: { description: "Button section description" },
    link: { ...linkData, label: "Button link section" },
    linkType: "button"
  };

  const postItCardProps: PostItCradProps = {
    cardTheme: "pearl",
    cardSections: [],
    Component: undefined
  };

  it("renders component with link section", () => {
    render(
      <PostItCard {...postItCardProps} cardSections={[linkSectionData]} />
    );
    expect(screen.getByText(linkSectionData.link.label)).toBeInTheDocument();
  });

  it("renders component with button section", () => {
    render(
      <PostItCard {...postItCardProps} cardSections={[buttonSectionData]} />
    );
    expect(screen.getByText(buttonSectionData.link.label)).toBeInTheDocument();
  });

  it("renders both link and button sections", () => {
    render(
      <PostItCard
        {...postItCardProps}
        cardSections={[buttonSectionData, linkSectionData]}
      />
    );
    expect(screen.getByText(buttonSectionData.link.label)).toBeInTheDocument();
    expect(screen.getByText(linkSectionData.link.label)).toBeInTheDocument();
  });
});
