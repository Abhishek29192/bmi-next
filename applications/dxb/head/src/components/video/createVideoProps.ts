import { VideoProps } from "@bmi-digital/components/dist/media/types";
import createImageProps from "../image/createImageProps";
import type { Data } from "./types";

const createVideoProps = (videoData: Data): VideoProps => {
  const {
    label,
    subtitle,
    videoUrl,
    videoRatio,
    previewMedia,
    defaultYouTubePreviewImage,
    layout,
    "data-testid": dataTestId
  } = videoData;

  const { height = 0, width = 0 } = videoRatio || {};

  const previewImageSource =
    (previewMedia && createImageProps(previewMedia)) ||
    defaultYouTubePreviewImage;

  return {
    label,
    subtitle,
    videoUrl,
    embedHeight: height,
    embedWidth: width,
    previewImageSource,
    layout: layout || "dialog",
    "data-testid": dataTestId
  };
};

export default createVideoProps;
