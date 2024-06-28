import { describe, it, jest } from "@jest/globals";
import { screen } from "@testing-library/react";
import React from "react";
import ContentfulImage from "../ContentfulImage";
import { renderWithProviders } from "../../../../__tests__/renderWithProviders";
import type { Options, Props } from "../types";
import type { getPosition, getSizes } from "../utils";

const mockGetPosition = jest.fn<typeof getPosition>();
const mockGetSizes = jest.fn<typeof getSizes>();
jest.mock("../utils", () => ({
  ...(jest.requireActual("../utils") as object),
  getPosition: (options: Options) => mockGetPosition(options),
  getSizes: (widths: Props["widths"]) => mockGetSizes(widths)
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("ContentfulImage", () => {
  it("should map the ContentfulImage props to CustomImageProps", () => {
    const contentfulImageProps: Props = {
      __typename: "ContentfulImage",
      title: "title",
      image: {
        file: {
          url: "https://localhost/image.jpg"
        }
      },
      altText: "alt-text",
      type: "Decorative",
      focalPoint: {
        x: 1,
        y: 2
      },
      className: "className",
      loading: "eager",
      size: "cover",
      position: "position",
      isMobile: false,
      "data-testid": "custom-test-id",
      widths: [1, 2, 3, 4, 5]
    };
    mockGetPosition.mockReturnValueOnce("returned position");
    mockGetSizes.mockReturnValueOnce("returned sizes");

    renderWithProviders(<ContentfulImage {...contentfulImageProps} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute(
      "src",
      "https://localhost/image.jpg?w=3840&q=50"
    );
    expect(image).toHaveAttribute("alt", contentfulImageProps.altText);
    expect(image).toHaveAttribute("draggable", "false");
    expect(image).toHaveStyle({
      objectFit: "cover",
      objectPosition: "returned position"
    });
    expect(image).toHaveClass(contentfulImageProps.className);
    expect(image).toHaveAttribute("decoding", "async");
    expect(image).toHaveAttribute("loading", contentfulImageProps.loading);
    expect(image).toHaveAttribute("sizes", "returned sizes");
    expect(image).toHaveAttribute(
      "data-testid",
      contentfulImageProps["data-testid"]
    );

    expect(mockGetPosition).toHaveBeenCalledWith({
      size: contentfulImageProps.size,
      position: contentfulImageProps.position,
      focalPoint: contentfulImageProps.focalPoint,
      isMobile: contentfulImageProps.isMobile
    });
    expect(mockGetSizes).toHaveBeenCalledWith(contentfulImageProps.widths);
  });

  it("should prepend URL with 'https:' if it doesn't already", () => {
    const contentfulImageProps: Props = {
      __typename: "ContentfulImage",
      title: "title",
      image: {
        file: {
          url: "//localhost/image.jpg"
        }
      },
      altText: "alt-text",
      type: "Decorative",
      focalPoint: {
        x: 1,
        y: 2
      },
      className: "className",
      loading: "eager",
      size: "cover",
      position: "position",
      isMobile: false,
      "data-testid": "custom-test-id",
      widths: [1, 2, 3, 4, 5]
    };
    mockGetPosition.mockReturnValueOnce("returned position");
    mockGetSizes.mockReturnValueOnce("returned sizes");

    renderWithProviders(<ContentfulImage {...contentfulImageProps} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute(
      "src",
      "https://localhost/image.jpg?w=3840&q=50"
    );
  });

  it("should set style.objectFit to size if provided", () => {
    const contentfulImageProps: Props = {
      __typename: "ContentfulImage",
      title: "title",
      image: {
        file: {
          url: "https://localhost/image.jpg"
        }
      },
      altText: "alt-text",
      type: "Decorative",
      focalPoint: {
        x: 1,
        y: 2
      },
      className: "className",
      loading: "eager",
      size: "contain",
      position: "position",
      isMobile: false,
      "data-testid": "custom-test-id",
      widths: [1, 2, 3, 4, 5]
    };
    mockGetPosition.mockReturnValueOnce("returned position");
    mockGetSizes.mockReturnValueOnce("returned sizes");

    renderWithProviders(<ContentfulImage {...contentfulImageProps} />);

    const image = screen.getByRole("img");
    expect(image).toHaveStyle({ objectFit: "contain" });
  });

  it("should set style.objectFit 'cover' if size not provided and type is 'Decorative'", () => {
    const contentfulImageProps: Props = {
      __typename: "ContentfulImage",
      title: "title",
      image: {
        file: {
          url: "https://localhost/image.jpg"
        }
      },
      altText: "alt-text",
      type: "Decorative",
      focalPoint: {
        x: 1,
        y: 2
      },
      className: "className",
      position: "position",
      isMobile: false,
      "data-testid": "custom-test-id",
      widths: [1, 2, 3, 4, 5]
    };
    mockGetPosition.mockReturnValueOnce("returned position");
    mockGetSizes.mockReturnValueOnce("returned sizes");

    renderWithProviders(<ContentfulImage {...contentfulImageProps} />);

    const image = screen.getByRole("img");
    expect(image).toHaveStyle({ objectFit: "cover" });
  });

  it("should set style.objectFit 'contain' if size not provided and type is 'Descriptive'", () => {
    const contentfulImageProps: Props = {
      __typename: "ContentfulImage",
      title: "title",
      image: {
        file: {
          url: "https://localhost/image.jpg"
        }
      },
      altText: "alt-text",
      type: "Descriptive",
      focalPoint: {
        x: 1,
        y: 2
      },
      className: "className",
      position: "position",
      isMobile: false,
      "data-testid": "custom-test-id",
      widths: [1, 2, 3, 4, 5]
    };
    mockGetPosition.mockReturnValueOnce("returned position");
    mockGetSizes.mockReturnValueOnce("returned sizes");

    renderWithProviders(<ContentfulImage {...contentfulImageProps} />);

    const image = screen.getByRole("img");
    expect(image).toHaveStyle({ objectFit: "contain" });
  });

  it("should set style.objectFit 'cover' if size and type is not provided", () => {
    const contentfulImageProps: Props = {
      __typename: "ContentfulImage",
      title: "title",
      image: {
        file: {
          url: "https://localhost/image.jpg"
        }
      },
      altText: "alt-text",
      focalPoint: {
        x: 1,
        y: 2
      },
      className: "className",
      position: "position",
      isMobile: false,
      "data-testid": "custom-test-id",
      widths: [1, 2, 3, 4, 5]
    };
    mockGetPosition.mockReturnValueOnce("returned position");
    mockGetSizes.mockReturnValueOnce("returned sizes");

    renderWithProviders(<ContentfulImage {...contentfulImageProps} />);

    const image = screen.getByRole("img");
    expect(image).toHaveStyle({ objectFit: "cover" });
  });

  it("should default loading to 'lazy'", () => {
    const contentfulImageProps: Props = {
      __typename: "ContentfulImage",
      title: "title",
      image: {
        file: {
          url: "https://localhost/image.jpg"
        }
      },
      altText: "alt-text",
      type: "Decorative",
      focalPoint: {
        x: 1,
        y: 2
      },
      className: "className",
      size: "cover",
      position: "position",
      isMobile: false,
      "data-testid": "custom-test-id",
      widths: [1, 2, 3, 4, 5]
    };
    mockGetPosition.mockReturnValueOnce("returned position");
    mockGetSizes.mockReturnValueOnce("returned sizes");

    renderWithProviders(<ContentfulImage {...contentfulImageProps} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("loading", "lazy");
  });
});
