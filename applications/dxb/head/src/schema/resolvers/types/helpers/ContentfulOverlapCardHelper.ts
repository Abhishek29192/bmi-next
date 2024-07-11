import createImageData from "../../../../__tests__/helpers/ImageDataHelper";
import createContentfulVideoData from "./ContetfulVideoHelper";
import creatContentfulParentPage from "./ContentfulParentPageHelper";
import type { ContentfulOverlapCard } from "../HomePage";

const createContentfulOverlapCard = (
  cardData?: Partial<ContentfulOverlapCard>
): ContentfulOverlapCard => ({
  __typename: "Page",
  slug: "slug",
  title: "Title",
  featuredMedia: createImageData(),
  sys: {
    id: "id"
  },
  featuredVideo: createContentfulVideoData(),
  parentPage: creatContentfulParentPage(),
  ...cardData
});

export default createContentfulOverlapCard;
