import NextImage from "next/image";
import { describe, expect, it, jest } from "@jest/globals";
import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import createImageProps from "../createImageProps";
import { ImageWidths } from "../types";
import type createContentfulImageProps from "../contentful-image/createContentfulImageProps";
import type { Props as ContentfulImageProps } from "../contentful-image/types";
import type createGenericImageProps from "../generic-image/createGenericImageProps";
import type { Props as GenericImageProps } from "../generic-image/types";
import type { CustomImageProps } from "@bmi-digital/components/media";

const mockCreateContentfulImageProps =
  jest.fn<typeof createContentfulImageProps>();
jest.mock("../contentful-image/createContentfulImageProps", () => ({
  __esModule: true,
  default: (props: ContentfulImageProps) =>
    mockCreateContentfulImageProps(props)
}));

const mockCreateGenericImageProps = jest.fn<typeof createGenericImageProps>();
jest.mock("../generic-image/createGenericImageProps", () => ({
  __esModule: true,
  default: (props: GenericImageProps) => mockCreateGenericImageProps(props)
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("createImageProps", () => {
  it("should call createContentfulImageProps if it's a ContentfulImage", () => {
    const props = {
      ...createImageData({ __typename: "Image" }),
      widths: [1, 2, 3, 4, 5] as ImageWidths
    };
    const customImageProps: CustomImageProps = {
      component: NextImage
    };
    mockCreateContentfulImageProps.mockReturnValue(customImageProps);

    const imageProps = createImageProps(props);

    expect(mockCreateContentfulImageProps).toHaveBeenCalledWith(props);
    expect(imageProps).toEqual(customImageProps);
  });

  it("should call createGenericImageProps if it's not a ContentfulImage", () => {
    const props = {
      altText: "alt-text",
      src: "http://localhost/generic-image.jpg",
      width: 100,
      height: 100,
      widths: [1, 2, 3, 4, 5]
    };
    const customImageProps: CustomImageProps = {
      component: NextImage
    };
    mockCreateGenericImageProps.mockReturnValue(customImageProps);

    const imageProps = createImageProps(props);

    expect(mockCreateGenericImageProps).toHaveBeenCalledWith(props);
    expect(imageProps).toEqual(customImageProps);
  });
});
