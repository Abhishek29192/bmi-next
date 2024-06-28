import NextImage from "next/image";
import { describe, expect, it } from "@jest/globals";
import createGenericImageProps from "../createGenericImageProps";
import type { Props } from "../types";
import type { CustomImageProps } from "@bmi-digital/components/dist/media/types";

describe("createGenericImageProps", () => {
  it("should map the GenericImage props to CustomImageProps", () => {
    const genericImageProps: Props = {
      src: "https://localhost/image.jpg",
      altText: "alt-text",
      width: 100,
      height: 200,
      className: "className",
      size: "cover",
      loading: "eager",
      "data-testid": "custom-test-id"
    };

    const customImageProps: CustomImageProps =
      createGenericImageProps(genericImageProps);

    expect(customImageProps).toEqual({
      component: NextImage,
      src: genericImageProps.src,
      alt: genericImageProps.altText,
      draggable: false,
      decoding: "async",
      loading: genericImageProps.loading,
      width: genericImageProps.width,
      height: genericImageProps.height,
      className: genericImageProps.className,
      style: {
        objectFit: genericImageProps.size
      },
      "data-testid": genericImageProps["data-testid"]
    });
  });

  it("should not include style if size is undefined", () => {
    const genericImageProps: Props = {
      src: "https://localhost/image.jpg",
      altText: "alt-text",
      width: 100,
      height: 200,
      className: "className",
      size: undefined,
      loading: "eager",
      "data-testid": "custom-test-id"
    };

    const customImageProps: CustomImageProps =
      createGenericImageProps(genericImageProps);

    expect(customImageProps.style).toBeUndefined();
  });
});
