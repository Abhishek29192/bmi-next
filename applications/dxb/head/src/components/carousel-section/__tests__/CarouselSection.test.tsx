import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@bmi-digital/components";
import React from "react";
import CarouselSection from "../CarouselSection";
import createCarouselSectionData from "../../../__tests__/helpers/CarouselSectionHelper";
import createPromoData from "../../../__tests__/helpers/PromoHelper";
import createVideoData from "../../../__tests__/helpers/VideoHelper";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import createLinkData from "../../../__tests__/helpers/LinkHelper";
import { renderWithProviders } from "../../../__tests__/renderWithProviders";

describe("Horizontal CarouselSection", () => {
  it("should not display the section title if provided", () => {
    const carouselSectionData = createCarouselSectionData({
      variant: "horizontal",
      title: "Carousel Section Title"
    });

    renderWithProviders(<CarouselSection data={carouselSectionData} />);

    expect(
      screen.queryByRole("heading", { name: carouselSectionData.title })
    ).not.toBeInTheDocument();
  });

  it("should display the slide brand logo if provided with brandWhiteBox as false", () => {
    const slideData = createPromoData({ brandLogo: "AeroDek" });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "horizontal",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.getByTestId("carousel-section-slide-brand-logo-0")
    ).toBeInTheDocument();
  });

  it("should not display the slide brand logo if not provided", () => {
    const slideData = createPromoData({ brandLogo: null });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "horizontal",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.queryByTestId("carousel-section-slide-brand-logo-0")
    ).not.toBeInTheDocument();
  });

  it("should display the slide cta", () => {
    const slideData = createPromoData({ cta: createLinkData() });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "horizontal",
          slides: [slideData]
        })}
      />
    );

    const link = screen.getByTestId("two-pane-carousel-slide-cta-0");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "cta-click1",
        action: slideData.cta.asset.file.url,
        label: slideData.cta.label
      })
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent(slideData.cta.label);
  });

  it("should not display the slide cta when not provided", () => {
    const slideData = createPromoData({ cta: null });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "horizontal",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.queryByTestId("two-pane-carousel-slide-cta-0")
    ).not.toBeInTheDocument();
  });

  it("should display the slide subtitle", () => {
    const slideData = createPromoData({
      subtitle: "Carousel Slide Subtitle"
    });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "horizontal",
          slides: [slideData]
        })}
      />
    );

    const description = screen.getByTestId(
      "two-pane-carousel-slide-description-0"
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(slideData.subtitle);
  });

  it("should not display the slide subtitle if not provided", () => {
    const slideData = createPromoData({
      subtitle: null
    });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "horizontal",
          slides: [slideData]
        })}
      />
    );

    const description = screen.getByTestId(
      "two-pane-carousel-slide-description-0"
    );
    expect(description).toBeInTheDocument();
    expect(description).not.toHaveTextContent(slideData.subtitle);
  });

  it("should display the slide title", () => {
    const slideData = createPromoData({ title: "Carousel Slide Title" });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "horizontal",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.getByTestId("two-pane-carousel-slide-title-0")
    ).toHaveTextContent(slideData.title);
  });

  it("should not display the slide title if not provided", () => {
    const slideData = createPromoData({ title: null });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "horizontal",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.queryByTestId("two-pane-carousel-slide-title-0")
    ).not.toBeInTheDocument();
  });

  it("should display the slide image if one is available", () => {
    const slideData = createPromoData({
      featuredMedia: createImageData(),
      featuredVideo: null
    });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "horizontal",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.getByTestId("carousel-section-slide-image-0")
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("carousel-section-slide-video-0")
    ).not.toBeInTheDocument();
  });

  it("should display the slide video if one is available", () => {
    const slideData = createPromoData({
      featuredMedia: null,
      featuredVideo: createVideoData()
    });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "horizontal",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.queryByTestId("carousel-section-slide-image-0")
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("carousel-section-slide-video-0")
    ).toBeInTheDocument();
  });

  it("should not display any slide media if none is available", () => {
    const slideData = createPromoData({
      featuredMedia: null,
      featuredVideo: null
    });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "horizontal",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.queryByTestId("carousel-section-slide-image-0")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("carousel-section-slide-video-0")
    ).not.toBeInTheDocument();
  });

  it("should display the section link", () => {
    const carouselSectionData = createCarouselSectionData({
      variant: "horizontal",
      link: createLinkData()
    });

    renderWithProviders(<CarouselSection data={carouselSectionData} />);

    const link = screen.getByTestId("carousel-section-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "cta-click1",
        action: `/no/${carouselSectionData.link.linkedPage.path}`,
        label: carouselSectionData.link.label
      })
    );
    expect(link).toHaveTextContent(carouselSectionData.link.label);
    expect(
      screen.getByTestId("carousel-section-arrow-forward-icon")
    ).toBeInTheDocument();
  });

  it("should not display the section link if not provided", () => {
    const carouselSectionData = createCarouselSectionData({
      variant: "horizontal",
      link: null
    });

    render(
      <ThemeProvider>
        <CarouselSection data={carouselSectionData} />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("carousel-section-link")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("carousel-section-arrow-forward-icon")
    ).not.toBeInTheDocument();
  });
});
describe("Vertical CarouselSection", () => {
  it("should display the section title if provided", () => {
    const carouselSectionData = createCarouselSectionData({
      variant: "vertical",
      title: "Carousel Section Title"
    });

    renderWithProviders(<CarouselSection data={carouselSectionData} />);

    expect(
      screen.getByRole("heading", { name: carouselSectionData.title })
    ).toBeInTheDocument();
  });

  it("should display the slide brand logo if provided with brandWhiteBox as false", () => {
    const slideData = createPromoData({ brandLogo: "AeroDek" });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "vertical",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.getByTestId("carousel-section-slide-brand-logo-0")
    ).toBeInTheDocument();
  });

  it("should not display the slide brand logo if not provided", () => {
    const slideData = createPromoData({ brandLogo: null });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "vertical",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.queryByTestId("carousel-section-slide-brand-logo-0")
    ).not.toBeInTheDocument();
  });

  it("should display the slide cta", () => {
    const slideData = createPromoData({ cta: createLinkData() });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "vertical",
          slides: [slideData]
        })}
      />
    );

    const link = screen.getByTestId("vertical-roller-slide-cta-0");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "cta-click1",
        action: slideData.cta.asset.file.url,
        label: slideData.cta.label
      })
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent(slideData.cta.label);
  });

  it("should not display the slide cta when not provided", () => {
    const slideData = createPromoData({ cta: null });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "vertical",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.queryByTestId("vertical-roller-slide-cta-0")
    ).not.toBeInTheDocument();
  });

  it("should display the slide subtitle", () => {
    const slideData = createPromoData({
      subtitle: "Carousel Slide Subtitle"
    });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "vertical",
          slides: [slideData]
        })}
      />
    );

    const description = screen.getByTestId(
      "vertical-roller-slide-description-0"
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(slideData.subtitle);
  });

  it("should not display the slide subtitle if not provided", () => {
    const slideData = createPromoData({
      subtitle: null
    });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "vertical",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.queryByTestId("vertical-roller-slide-description-0")
    ).not.toBeInTheDocument();
  });

  it("should display the slide title", () => {
    const slideData = createPromoData({ title: "Carousel Slide Title" });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "vertical",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.getByTestId("vertical-roller-slide-title-0")
    ).toHaveTextContent(slideData.title);
  });

  it("should not display the slide title if not provided", () => {
    const slideData = createPromoData({ title: null });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "vertical",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.queryByTestId("vertical-roller-slide-title-0")
    ).not.toBeInTheDocument();
  });

  it("should display the slide image if one is available", () => {
    const slideData = createPromoData({
      featuredMedia: createImageData(),
      featuredVideo: null
    });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "vertical",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.getByTestId("carousel-section-slide-image-0")
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("carousel-section-slide-video-0")
    ).not.toBeInTheDocument();
  });

  it("should display the slide video if one is available", () => {
    const slideData = createPromoData({
      featuredMedia: null,
      featuredVideo: createVideoData()
    });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "vertical",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.queryByTestId("carousel-section-slide-image-0")
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId("carousel-section-slide-video-0")
    ).toBeInTheDocument();
  });

  it("should not display any slide media if none is available", () => {
    const slideData = createPromoData({
      featuredMedia: null,
      featuredVideo: null
    });

    renderWithProviders(
      <CarouselSection
        data={createCarouselSectionData({
          variant: "vertical",
          slides: [slideData]
        })}
      />
    );

    expect(
      screen.queryByTestId("carousel-section-slide-image-0")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("carousel-section-slide-video-0")
    ).not.toBeInTheDocument();
  });

  it("should display the section link", () => {
    const carouselSectionData = createCarouselSectionData({
      variant: "vertical",
      link: createLinkData()
    });

    renderWithProviders(<CarouselSection data={carouselSectionData} />);

    const link = screen.getByTestId("carousel-section-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "data-gtm",
      JSON.stringify({
        id: "cta-click1",
        action: `/no/${carouselSectionData.link.linkedPage.path}`,
        label: carouselSectionData.link.label
      })
    );
    expect(link).toHaveTextContent(carouselSectionData.link.label);
    expect(
      screen.getByTestId("carousel-section-arrow-forward-icon")
    ).toBeInTheDocument();
  });

  it("should not display the section link if not provided", () => {
    const carouselSectionData = createCarouselSectionData({
      variant: "vertical",
      link: null
    });

    render(
      <ThemeProvider>
        <CarouselSection data={carouselSectionData} />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("carousel-section-link")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("carousel-section-arrow-forward-icon")
    ).not.toBeInTheDocument();
  });
});
