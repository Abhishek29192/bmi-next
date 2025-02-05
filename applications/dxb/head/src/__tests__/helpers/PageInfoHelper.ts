import { Data } from "../../components/PageInfo";

const createPageInfoData = (pageInfoData?: Partial<Data>): Data => ({
  __typename: "Page",
  id: "example-id",
  title: "example-title",
  subtitle: null,
  brandLogo: null,
  slug: "example/slug",
  path: "example/path",
  date: null,
  rawDate: null,
  tags: null,
  featuredMedia: null,
  featuredVideo: null,
  heroType: null,
  sections: null,
  ...pageInfoData
});

export default createPageInfoData;
