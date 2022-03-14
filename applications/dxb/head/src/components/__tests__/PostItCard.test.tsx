import { ThemeProvider } from "@bmi/components";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Data as LinkProps } from "../../components/Link";
import PostItCard, {
  Data as SectionProps,
  Props as PostItCradProps
} from "../../components/PostItCard";

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
      <ThemeProvider>
        <PostItCard {...postItCardProps} cardSections={[linkSectionData]} />
      </ThemeProvider>
    );
    expect(screen.getByText(linkSectionData.link.label)).toBeInTheDocument();
  });

  it("renders component with button section", () => {
    render(
      <ThemeProvider>
        <PostItCard {...postItCardProps} cardSections={[buttonSectionData]} />
      </ThemeProvider>
    );
    expect(screen.getByText(buttonSectionData.link.label)).toBeInTheDocument();
  });

  it("renders both link and button sections", () => {
    render(
      <ThemeProvider>
        <PostItCard
          {...postItCardProps}
          cardSections={[buttonSectionData, linkSectionData]}
        />
      </ThemeProvider>
    );
    expect(screen.getByText(buttonSectionData.link.label)).toBeInTheDocument();
    expect(screen.getByText(linkSectionData.link.label)).toBeInTheDocument();
  });
});
