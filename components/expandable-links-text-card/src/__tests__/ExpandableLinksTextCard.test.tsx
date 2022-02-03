import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Button from "@bmi/button";
import ExpandableLinksTextCard from "../";

describe("ExpandableLinksTextCard component", () => {
  it("renders correctly", () => {
    const { container } = render(
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
    const { container } = render(
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
    const { container } = render(
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
    const { container, getByText } = render(
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
