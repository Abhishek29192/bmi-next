import creatContentfulParentPage from "./ContentfulParentPageHelper";
import type { ContentfulBrand } from "../HomePage";

const createContentfulHomePageBrand = (
  brand?: Partial<ContentfulBrand>
): ContentfulBrand => ({
  title: "Zanda",
  subtitle: "Zanda subtitle",
  brandLogo: "Zanda",
  sys: { id: "zanda-brand-id" },
  slug: "zanda-brand-slug",
  parentPage: creatContentfulParentPage(),
  ...brand
});

export default createContentfulHomePageBrand;
