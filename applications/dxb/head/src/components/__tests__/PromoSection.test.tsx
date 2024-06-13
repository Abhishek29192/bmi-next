import React from "react";
import { screen } from "@testing-library/react";
import PromoSection from "../PromoSection";
import createPromoData from "../../__tests__/helpers/PromoHelper";
import { renderWithProviders } from "../../__tests__/renderWithProviders";
import createVideoData from "../../__tests__/helpers/VideoHelper";
import createImageData from "../../__tests__/helpers/ImageDataHelper";

describe("PromoSection", () => {
  it("renders with video if one is provided", () => {
    const promoData = createPromoData({
      featuredVideo: createVideoData(),
      featuredMedia: null,
      body: null
    });
    renderWithProviders(<PromoSection data={promoData} />);
    expect(
      screen.getByTestId("youtube-inline-react-player")
    ).toBeInTheDocument();
  });

  it("renders an image if one is provided, with an object-position style property of 'top left'", () => {
    const promoData = createPromoData({
      featuredMedia: createImageData({ altText: "featured image alt text" }),
      featuredVideo: null,
      body: null
    });
    renderWithProviders(<PromoSection data={promoData} />);
    expect(screen.getByAltText("featured image alt text")).toBeInTheDocument();
    expect(screen.getByAltText("featured image alt text")).toHaveStyle({
      "object-position": "top left"
    });
  });

  it("should not display media if none is available", () => {
    const promoData = createPromoData({
      featuredVideo: null,
      featuredMedia: null,
      body: null
    });
    renderWithProviders(<PromoSection data={promoData} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("youtube-inline-react-player")
    ).not.toBeInTheDocument();
  });
});
