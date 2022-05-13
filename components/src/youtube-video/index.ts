// istanbul ignore file: doesn't hold any logic
import YoutubeVideo from "./YoutubeVideo";
import { getDefaultPreviewImageSource } from "./utils";

export const getDefaultPreviewImage = getDefaultPreviewImageSource;
export type { Layout, Props as YoutubeVideoProps, GTM } from "./YoutubeVideo";
export default YoutubeVideo;
