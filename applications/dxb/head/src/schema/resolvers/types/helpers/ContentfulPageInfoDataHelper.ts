import createTag from "../../../../__tests__/helpers/TagHelper";
import createImageData from "../../../../__tests__/helpers/ImageDataHelper";
import createContentfulVideoData from "./ContetfulVideoHelper";
import type { ContentfulPageInfoCardData } from "../../types/PageInfoCardData";

const createContentfulInfoPageData = (
  data?: Partial<ContentfulPageInfoCardData>
): ContentfulPageInfoCardData => ({
  __typename: "Page",
  title: "Title",
  subtitle: "Subtitle",
  brandLogo: "Zanda",
  slug: "slug",
  date: null,
  featuredMedia: createImageData(),
  featuredVideo: createContentfulVideoData(),
  parentPage: {
    __typename: "Page",
    sys: {
      id: "Parent page id"
    },
    title: "Parent page title",
    slug: "parent-page-slug",
    parentPage: null
  },
  sys: {
    id: "some-id"
  },
  tagsCollection: {
    items: [createTag()]
  },
  ...data
});

export default createContentfulInfoPageData;
