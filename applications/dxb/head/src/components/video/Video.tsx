import YoutubeVideo from "@bmi-digital/components/youtube-video";
import { useMemo } from "react";
import React from "react";
import { useGTM } from "../../utils/google-tag-manager";
import type { Data } from "./types";
import type { CustomImageProps } from "@bmi-digital/components/dist/media/types";

export type Props = Omit<Data, "previewMedia"> & {
  previewMedia?: CustomImageProps;
};

const Video = ({
  label,
  subtitle,
  videoUrl,
  previewMedia,
  videoRatio,
  defaultYouTubePreviewImage,
  layout,
  ...props
}: Props) => {
  const gtm = useMemo(
    () => ({
      id: "cta-click--video-youtube",
      label: `${videoUrl}-${label}`,
      action: "Play"
    }),
    [videoUrl, label]
  );

  const { dataGTM, pushGTMEvent } = useGTM(gtm);

  return (
    <YoutubeVideo
      label={label}
      subtitle={subtitle}
      videoUrl={videoUrl}
      embedHeight={videoRatio?.height || 0}
      embedWidth={videoRatio?.width || 0}
      previewImageSource={previewMedia || defaultYouTubePreviewImage}
      layout={layout}
      onGTMEvent={pushGTMEvent}
      dataGTM={dataGTM}
      {...props}
    />
  );
};

export default Video;
