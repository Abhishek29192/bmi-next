import createImageProps from "../image/createImageProps";
import type { ImageWidths } from "../image/types";
import type { VideoProps } from "@bmi-digital/components/dist/media/types";
import type { Data } from "./types";

type Props = Data & {
  previewMediaWidths: ImageWidths;
};

const createVideoProps = (videoData: Props): VideoProps => {
  const {
    label,
    subtitle,
    videoUrl,
    videoRatio,
    previewMedia,
    previewMediaWidths,
    defaultYouTubePreviewImage,
    layout,
    className,
    "data-testid": dataTestId
  } = videoData;

  const { height = 0, width = 0 } = videoRatio || {};

  const previewImageSource = previewMedia
    ? createImageProps({ ...previewMedia, widths: previewMediaWidths })
    : defaultYouTubePreviewImage;

  return {
    label,
    subtitle,
    videoUrl,
    embedHeight: height,
    embedWidth: width,
    previewImageSource,
    className,
    layout: layout || "dialog",
    "data-testid": dataTestId,
    dataGTM: {
      id: "cta-click--video-youtube",
      label: `${videoUrl}-${label}`,
      action: "Play"
    }
  };
};

export default createVideoProps;
