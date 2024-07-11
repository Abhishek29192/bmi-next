import type { ParentPage } from "../Common";

const creatContentfulParentPage = (
  parentPage?: Partial<ParentPage>
): ParentPage => ({
  __typename: "Page",
  sys: {
    id: "parent-page-id"
  },
  title: "Parent page title",
  slug: "parent-page-slug",
  parentPage: null,
  ...parentPage
});

export default creatContentfulParentPage;
