import React from "react";
import { render, screen } from "@testing-library/react";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import ExploreBar from "../ExploreBar";
import createExploreBarData from "../../__tests__/helpers/ExploreBarHelper";
import {
  createAssetLinkData,
  createExternalLinkData,
  createInternalLinkData
} from "../../__tests__/helpers/LinkHelper";

describe("ExploreBar component", () => {
  it("should render the Explore Bar heading, when provided", () => {
    const exploreBarData = createExploreBarData();

    render(
      <ThemeProvider>
        <ExploreBar data={exploreBarData} />
      </ThemeProvider>
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      exploreBarData.label!
    );
  });

  it("should render all links provided in the array, using the link label as the button label text", () => {
    const exploreBarData = createExploreBarData({
      links: [
        createInternalLinkData({ label: "Explore-Bar-Link-1" }),
        createInternalLinkData({ label: "Explore-Bar-Link-2" })
      ]
    });

    render(
      <ThemeProvider>
        <ExploreBar data={exploreBarData} />
      </ThemeProvider>
    );

    expect(
      screen.getByRole("link", { name: exploreBarData.links[0].label })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: exploreBarData.links[1].label })
    ).toBeInTheDocument();
  });

  it("should render an asset link, if provided", () => {
    const exploreBarData = createExploreBarData({
      links: [createAssetLinkData()]
    });

    render(
      <ThemeProvider>
        <ExploreBar data={exploreBarData} />
      </ThemeProvider>
    );

    const link = screen.getByRole("link", {
      name: exploreBarData.links[0].label
    });

    expect(link).toHaveAttribute(
      "href",
      exploreBarData.links[0].asset!.file.url
    );

    expect(link).toHaveAttribute("download");
    expect(link).toHaveAttribute("referrerpolicy", "no-referrer");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "cta-click1",
        action: exploreBarData.links[0].asset!.file.url,
        label: exploreBarData.links[0].label
      })
    );
  });

  it("should render an external link, if provided", () => {
    const exploreBarData = createExploreBarData({
      links: [createExternalLinkData()]
    });

    render(
      <ThemeProvider>
        <ExploreBar data={exploreBarData} />
      </ThemeProvider>
    );

    const link = screen.getByRole("link", {
      name: exploreBarData.links[0].label
    });

    expect(link).toHaveAttribute("href", exploreBarData.links[0].url);
    expect(link).toHaveAttribute("referrerpolicy", "no-referrer");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "cta-click1",
        action: exploreBarData.links[0].url,
        label: exploreBarData.links[0].label
      })
    );
  });

  it("should render an internal link, if provided", () => {
    const exploreBarData = createExploreBarData({
      links: [createInternalLinkData()]
    });

    render(
      <ThemeProvider>
        <ExploreBar data={exploreBarData} />
      </ThemeProvider>
    );

    const link = screen.getByRole("link", {
      name: exploreBarData.links[0].label
    });

    expect(link).toHaveAttribute(
      "href",
      `/${exploreBarData.links[0].linkedPage!.path}/`
    );

    expect(link).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "cta-click1",
        action: `/${exploreBarData.links[0].linkedPage!.path}/`,
        label: exploreBarData.links[0].label
      })
    );
  });
});
