import { fireEvent } from "@testing-library/react";
import React from "react";
import Button from "../../button/Button";
import { renderWithThemeProvider } from "../../__tests__/helper";
import ExpandableLinksTextCard from "../ExpandableLinksTextCard";

describe("ExpandableLinksTextCard component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <ExpandableLinksTextCard
        title="Heading One"
        links={[
          { action: { model: "htmlLink", href: "/" }, label: "Link One" },
          { action: { model: "htmlLink", href: "/" }, label: "Link Two" },
          { action: { model: "htmlLink", href: "/" }, label: "Link Three" }
        ]}
        openButton={<Button>Open</Button>}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with more than 3 links", () => {
    const { container } = renderWithThemeProvider(
      <ExpandableLinksTextCard
        title="Heading One"
        links={[
          { action: { model: "htmlLink", href: "/" }, label: "Link One" },
          { action: { model: "htmlLink", href: "/" }, label: "Link Two" },
          { action: { model: "htmlLink", href: "/" }, label: "Link Three" },
          { action: { model: "htmlLink", href: "/" }, label: "Link Four" },
          { action: { model: "htmlLink", href: "/" }, label: "Link Five" },
          { action: { model: "htmlLink", href: "/" }, label: "Link Six" },
          { action: { model: "htmlLink", href: "/" }, label: "Link Seven" }
        ]}
        openButton={<Button>Open</Button>}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with download action model", () => {
    const { container } = renderWithThemeProvider(
      <ExpandableLinksTextCard
        title="Heading One"
        links={[
          { action: { model: "download", href: "/" }, label: "Link One" },
          { action: { model: "download", href: "/" }, label: "Link Two" }
        ]}
        openButton={<Button>Open</Button>}
        separator={1}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with closeButton", () => {
    const { container, getByText } = renderWithThemeProvider(
      <ExpandableLinksTextCard
        title="Heading One"
        links={[
          { action: { model: "htmlLink", href: "/" }, label: "Link One" },
          { action: { model: "htmlLink", href: "/" }, label: "Link Two" },
          { action: { model: "htmlLink", href: "/" }, label: "Link Three" }
        ]}
        openButton={<Button>Open</Button>}
        closeButton={<Button>Close</Button>}
        separator={2}
      />
    );

    fireEvent.click(getByText("Open"));

    expect(container).toMatchSnapshot();
  });
});
