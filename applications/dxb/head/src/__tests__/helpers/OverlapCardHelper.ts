import createVideoData from "./VideoHelper";
import type { Card } from "../../components/OverlapCards";

const createOverlapCardData = (card?: Partial<Card>): Card => ({
  title: "Promo Card with Video",
  featuredMedia: null,
  featuredVideo: createVideoData(),
  path: "promo-video/",
  ...card
});

export default createOverlapCardData;
