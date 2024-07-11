import { DataTypeEnum } from "../../../../components/link/types";
import createContentfulFormSectionData from "./ContentfulFormSectionHelper";
import creatContentfulParentPage from "./ContentfulParentPageHelper";
import type { ContentfulLink } from "../Link";

const createContentfulLink = (
  contentfulLinkData?: Partial<ContentfulLink>
): ContentfulLink => ({
  __typename: "Link",
  icon: "FilePDF",
  isLabelHidden: false,
  label: "Link label",
  queryParams: "?name=FakeName",
  url: "http://localhost:3000/link-url",
  type: DataTypeEnum.Internal,
  parameters: { param1: "value1" },
  dialogContent: createContentfulFormSectionData(),
  sys: {
    id: "link-id"
  },
  linkedPage: {
    __typename: "Page",
    sys: {
      id: "some-id"
    },
    title: "Linked page title",
    slug: "slug",
    parentPage: creatContentfulParentPage()
  },
  asset: {
    url: "http://localhost:3000/asset.pdf"
  },
  hubSpotCTAID: "hubspot-cta-id",
  ...contentfulLinkData
});

export const createContentfulNonRecursiveLink = (
  contentfulLinkData?: Partial<ContentfulLink>
): ContentfulLink => ({
  __typename: "Link",
  icon: "FilePDF",
  isLabelHidden: false,
  label: "Link label",
  queryParams: "?name=FakeName",
  url: "http://localhost:3000/link-url",
  type: DataTypeEnum.Internal,
  parameters: { ["param1"]: "value1" },
  dialogContent: null,
  sys: {
    id: "link-id"
  },
  linkedPage: {
    __typename: "Page",
    sys: {
      id: "some-id"
    },
    title: "Linked page title",
    slug: "slug",
    parentPage: creatContentfulParentPage()
  },
  asset: {
    url: "http://localhost:3000/asset.pdf"
  },
  hubSpotCTAID: "hubspot-cta-id",
  ...contentfulLinkData
});
export default createContentfulLink;
