import { MediaData } from "@bmi/components";
import { act, render } from "@testing-library/react";
import React from "react";
import {
  GallerySectionImage,
  GallerySectionMedias,
  GallerySectionVideo
} from "../../utils/media";
import { renderImage } from "../Image";
import MediaGallerySection, { Data } from "../MediaGallerySection";
import { RichTextData } from "../RichText";
import {
  createContentfulImage,
  createContentfulVideo,
  createImage,
  createMockedYoutubeVideo,
  createPreviewMedia
} from "./helpers/mediaHelper";

const transformMediaSrc = jest.fn();
jest.mock("../../utils/media", () => ({
  transformMediaSrc: (
    media: readonly GallerySectionMedias[]
  ): Promise<MediaData[]> => transformMediaSrc(media)
}));

const raw = {
  nodeType: "document",
  data: {},
  content: [
    {
      nodeType: "heading-2",
      content: [{ nodeType: "text", value: "Heading 2", marks: [], data: {} }],
      data: {}
    },
    {
      nodeType: "paragraph",
      content: [
        {
          nodeType: "text",
          value: "this is a test paragraph",
          marks: [],
          data: {}
        }
      ],
      data: {}
    }
  ]
};

const document: RichTextData = {
  raw: JSON.stringify(raw),
  references: [
    {
      __typename: "NonType",
      contentful_id: "3tcysaa3PGMlm42U4WnlmK"
    }
  ]
};

describe("MediaGallerySection component", () => {
  it("renders correctly", async () => {
    const mediaImage = createContentfulImage();
    const mediaVideo = createContentfulVideo({
      previewMedia: createPreviewMedia({
        image: createImage({
          thumbnail: {
            src: "//video-image.asset.jpg"
          },
          file: {
            fileName: "Lorem ipsum video image file name",
            url: "//video-images.asset.jpg"
          }
        })
      })
    });
    const data: Data = {
      __typename: "ContentfulMediaGallerySection",
      title: "Lorem ipsum",
      longDescription: null,
      medias: [
        mediaImage as GallerySectionImage,
        mediaVideo as GallerySectionVideo
      ]
    };

    transformMediaSrc.mockResolvedValueOnce([
      {
        media: renderImage(mediaImage as GallerySectionImage),
        thumbnail: "//image.asset.jpg",
        caption: undefined,
        altText: "Lorem ipsum image alt text",
        isVideo: false
      },
      {
        media: createMockedYoutubeVideo(),
        thumbnail: "//video-image.asset.jpg",
        caption: "Lorem ipsum video subtitle",
        altText: "Lorem ipsum video label",
        isVideo: true
      }
    ]);

    const { container, rerender } = render(<MediaGallerySection data={data} />);
    await act(async () => {
      rerender(<MediaGallerySection data={data} />);
    });
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with long description", async () => {
    const mediaImage = createContentfulImage({
      altText: "Lorem ipsum",
      image: createImage({
        file: {
          fileName: "Lorem ipsum",
          url: "//images.asset.jpg"
        }
      })
    });
    const data: Data = {
      __typename: "ContentfulMediaGallerySection",
      title: "Lorem ipsum",
      longDescription: document,
      medias: [mediaImage as GallerySectionImage]
    };

    transformMediaSrc.mockResolvedValueOnce([
      {
        media: renderImage(mediaImage as GallerySectionImage),
        thumbnail: "//image.asset.jpg",
        caption: undefined,
        altText: "Lorem ipsum",
        isVideo: false
      }
    ]);

    const { container, rerender, getByText } = render(
      <MediaGallerySection data={data} />
    );
    await act(async () => {
      rerender(<MediaGallerySection data={data} />);
    });

    expect(getByText("this is a test paragraph")).not.toBeNull();
    expect(container).toMatchSnapshot();
  });
});
