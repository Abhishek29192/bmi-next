import NextImage from "next/image";
import { describe, expect, it, jest } from "@jest/globals";
import createContentfulImageProps from "../createContentfulImageProps";
import type { ImageLoaderProps } from "next/image";
import type { Options, Props } from "../types";
import type { getPosition, getSizes, loader } from "../utils";
import type { CustomImageProps } from "@bmi-digital/components/media";

const mockGetPosition = jest.fn<typeof getPosition>();
const mockGetSizes = jest.fn<typeof getSizes>();
const mockLoader = jest.fn<typeof loader>();
jest.mock("../utils", () => ({
  ...(jest.requireActual("../utils") as object),
  getPosition: (options: Options) => mockGetPosition(options),
  getSizes: (widths: Props["widths"]) => mockGetSizes(widths),
  loader: (imageLoaderProps: ImageLoaderProps) => mockLoader(imageLoaderProps)
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("createContentfulImageProps", () => {
  it("should map the ContentfulImage props to CustomImageProps", () => {
    const contentfulImageProps: Props = {
      __typename: "Image",
      title: "title",
      image: {
        url: "https://localhost/image.jpg"
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

    const customImageProps: CustomImageProps =
      createContentfulImageProps(contentfulImageProps);

    expect(customImageProps).toEqual(
      expect.objectContaining({
        component: NextImage,
        loader: expect.any(Function),
        src: contentfulImageProps.image.url,
        alt: contentfulImageProps.altText,
        draggable: false,
        style: {
          objectFit: "cover",
          objectPosition: "returned position",
          width: undefined,
          height: undefined
        },
        className: contentfulImageProps.className,
        decoding: "async",
        fill: true,
        loading: contentfulImageProps.loading,
        sizes: "returned sizes",
        "data-testid": contentfulImageProps["data-testid"]
      })
    );
    (customImageProps.loader as () => unknown)();
    expect(mockGetPosition).toHaveBeenCalledWith({
      size: contentfulImageProps.size,
      position: contentfulImageProps.position,
      focalPoint: contentfulImageProps.focalPoint,
      isMobile: contentfulImageProps.isMobile
    });
    expect(mockGetSizes).toHaveBeenCalledWith(contentfulImageProps.widths);
    expect(mockLoader).toHaveBeenCalled();
  });

  it("should prepend URL with 'https:' if it doesn't already", () => {
    const contentfulImageProps: Props = {
      __typename: "Image",
      title: "title",
      image: {
        url: "//localhost/image.jpg"
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

    const customImageProps: CustomImageProps =
      createContentfulImageProps(contentfulImageProps);

    expect(customImageProps.src).toEqual("https://localhost/image.jpg");
  });

  it("should set style.objectFit to size if provided", () => {
    const contentfulImageProps: Props = {
      __typename: "Image",
      title: "title",
      image: {
        url: "https://localhost/image.jpg"
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

    const customImageProps: CustomImageProps =
      createContentfulImageProps(contentfulImageProps);

    expect((customImageProps.style as { objectFit: string }).objectFit).toEqual(
      "contain"
    );
  });

  it("should set style.objectFit 'cover' if size not provided and type is 'Decorative'", () => {
    const contentfulImageProps: Props = {
      __typename: "Image",
      title: "title",
      image: {
        url: "https://localhost/image.jpg"
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

    const customImageProps: CustomImageProps =
      createContentfulImageProps(contentfulImageProps);

    expect((customImageProps.style as { objectFit: string }).objectFit).toEqual(
      "cover"
    );
  });

  it("should set style.objectFit 'contain' if size not provided and type is 'Descriptive'", () => {
    const contentfulImageProps: Props = {
      __typename: "Image",
      title: "title",
      image: {
        url: "https://localhost/image.jpg"
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

    const customImageProps: CustomImageProps =
      createContentfulImageProps(contentfulImageProps);

    expect((customImageProps.style as { objectFit: string }).objectFit).toEqual(
      "contain"
    );
  });

  it("should set style.objectFit 'cover' if size and type is not provided", () => {
    const contentfulImageProps: Props = {
      __typename: "Image",
      title: "title",
      image: {
        url: "https://localhost/image.jpg"
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

    const customImageProps: CustomImageProps =
      createContentfulImageProps(contentfulImageProps);

    expect((customImageProps.style as { objectFit: string }).objectFit).toEqual(
      "cover"
    );
  });

  it("should default loading to 'lazy'", () => {
    const contentfulImageProps: Props = {
      __typename: "Image",
      title: "title",
      image: {
        url: "https://localhost/image.jpg"
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

    const customImageProps: CustomImageProps =
      createContentfulImageProps(contentfulImageProps);

    expect(customImageProps.loading).toEqual("lazy");
  });
});
