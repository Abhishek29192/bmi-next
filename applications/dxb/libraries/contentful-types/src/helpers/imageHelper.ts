import createAsset, { createFullyPopulatedAsset } from "./assetHelper";
import createEntrySys from "./entrySysHelper";
import type { EntryPartial } from "./helperTypes";
import type { TypeImage } from "../types";

export const createFullyPopulatedImage = (
  contentfulImage?: EntryPartial<TypeImage<undefined, "en-US">>
): TypeImage<undefined, "en-US"> => {
  const image = createImage(contentfulImage);
  return {
    ...image,
    fields: {
      ...image.fields,
      caption: "caption",
      focalPoint: {
        focalPoint: {
          x: 0,
          y: 0
        }
      },
      image: createFullyPopulatedAsset({
        fields: {
          file: {
            url: "https://localhost:9000/asset-filename.jpg",
            details: {
              size: 1,
              image: {
                width: 100,
                height: 100
              }
            },
            fileName: "asset-filename.jpg",
            contentType: "image/jpeg"
          }
        }
      }),
      type: "Decorative",
      ...contentfulImage?.fields
    }
  };
};

const createImage = (
  contentfulImage?: EntryPartial<TypeImage<undefined, "en-US">>
): TypeImage<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "image"
      }
    },
    ...contentfulImage?.sys
  },
  metadata: {
    tags: [],
    ...contentfulImage?.metadata
  },
  fields: {
    altText: "image alt text",
    image: createAsset({
      fields: {
        file: {
          url: "https://localhost:9000/asset-filename.jpg",
          details: {
            size: 1,
            image: {
              width: 100,
              height: 100
            }
          },
          fileName: "asset-filename.jpg",
          contentType: "image/jpeg"
        }
      }
    }),
    title: "image title",
    ...contentfulImage?.fields
  }
});

export default createImage;
