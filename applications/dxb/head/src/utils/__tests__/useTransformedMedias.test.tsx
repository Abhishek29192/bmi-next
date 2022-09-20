import { MediaData } from "@bmi/components";
import { renderHook } from "@testing-library/react-hooks";
import { renderImage } from "../../components/Image";
import { createContentfulImage } from "../../components/__tests__/helpers/mediaHelper";
import { GallerySectionImage, GallerySectionMedias } from "../../utils/media";
import { useTransformedMedias } from "../useTransformedMedias";

const transformMediaSrc = jest.fn();
jest.mock("../../utils/media", () => ({
  transformMediaSrc: (
    media: readonly GallerySectionMedias[]
  ): Promise<MediaData[]> => transformMediaSrc(media)
}));

describe("useTransformedMedias", () => {
  it("should return transformed medias", async () => {
    const mediaImage = createContentfulImage();
    const transformedItem = {
      media: renderImage(mediaImage as GallerySectionImage),
      thumbnail: "//image.asset.jpg",
      caption: null,
      altText: "Lorem ipsum image alt text",
      isVideo: false
    };
    transformMediaSrc.mockResolvedValueOnce([transformedItem]);
    const { result, waitForNextUpdate } = renderHook(() =>
      useTransformedMedias([mediaImage])
    );
    await waitForNextUpdate();

    expect(result.all[0]).toStrictEqual([]);
    expect(result.all[1]).toStrictEqual([transformedItem]);
  });
});
