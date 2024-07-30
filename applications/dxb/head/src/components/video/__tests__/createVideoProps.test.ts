import createImageData from "../../../__tests__/helpers/ImageDataHelper";
import createVideoData from "../../../__tests__/helpers/VideoHelper";
import createImageProps from "../../image/createImageProps";
import createVideoProps from "../createVideoProps";
import type { Data } from "../types";

describe("createVideoProps", () => {
  it("should contain a label property", () => {
    const label = "example-label";
    const videoData = createVideoData({ label });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("label", label);
  });

  it("should contain a subtitle property, if defined", () => {
    const subtitle = "example-subtitle";
    const videoData = createVideoData({ subtitle });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("subtitle", subtitle);
  });

  it("should still contain a subtitle property, if subtitle is null", () => {
    const subtitle = null;
    const videoData = createVideoData({ subtitle });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("subtitle", subtitle);
  });

  it("should always contain a videoUrl property", () => {
    const videoUrl = "example-video-url";
    const videoData = createVideoData({ videoUrl });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("videoUrl", videoUrl);
  });

  it("should contain a embedHeight and embedWidth properties, if videoRatio is defined", () => {
    const videoRatio = { height: 10, width: 10 };
    const videoData = createVideoData({ videoRatio });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("embedHeight", 10);
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("embedWidth", 10);
  });

  it("should default the embedHeight and embedWidth properties to zero, if videoRatio is null", () => {
    const videoRatio = null;
    const videoData = createVideoData({ videoRatio });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("embedHeight", 0);
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("embedWidth", 0);
  });

  it("should create a previewImageSource object, if previewMedia is defined", () => {
    const previewMedia: Data["previewMedia"] = createImageData();
    const videoData = createVideoData({ previewMedia });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty(
      "previewImageSource",
      createImageProps({ ...previewMedia, widths: [10, 10, 10, 10, 10] })
    );
  });

  it("should use the defaultYouTubePreviewImage if previewMedia is null", () => {
    const previewMedia = null;
    const videoData = createVideoData({ previewMedia });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty(
      "previewImageSource",
      "http://localhost:8080/default-image.jpg"
    );
  });

  it("should contain a classname property if classname is defined", () => {
    const className = "example-className";
    const videoData = createVideoData({ className });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("className", className);
  });

  it("should contain a classname property if classname is undefined", () => {
    const className = undefined;
    const videoData = createVideoData({ className });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("className", className);
  });

  it("should contain a layout property if layout is defined", () => {
    const layout: Data["layout"] = "in-place";
    const videoData = createVideoData({ layout });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("layout", layout);
  });

  it("should default the layout property to 'dialog' if layout is undefined", () => {
    const layout: Data["layout"] = undefined;
    const videoData = createVideoData({ layout });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("layout", "dialog");
  });

  it("should contain a data-testid property if data-testid is defined", () => {
    const dataTestId = "example-data-test-id";
    const videoData = createVideoData({ "data-testid": dataTestId });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("data-testid", dataTestId);
  });

  it("should contain a data-testid property if data-testid is undefined", () => {
    const dataTestId = undefined;
    const videoData = createVideoData({ "data-testid": dataTestId });
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("data-testid", dataTestId);
  });

  it("should always contain the following data-gtm property, using the videoUrl and label values as the GTM label property", () => {
    const videoData = createVideoData();
    expect(
      createVideoProps({
        ...videoData,
        previewMediaWidths: [10, 10, 10, 10, 10]
      })
    ).toHaveProperty("dataGTM", {
      id: "cta-click--video-youtube",
      label: `${videoData.videoUrl}-${videoData.label}`,
      action: "Play"
    });
  });
});
