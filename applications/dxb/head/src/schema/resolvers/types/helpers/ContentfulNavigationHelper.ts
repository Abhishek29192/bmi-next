import createNavigationItem from "../../../../__tests__/helpers/NavigationItemHelper";
import createContentfulLink from "./ContentfulLinkHelper";
import createContentfulPromoData from "./ContentfulPromoHelper";
import type { Navigation } from "../Site";

const createContentfulNavigation = (
  navigation?: Partial<Navigation>
): Navigation => ({
  __typename: "Navigation",
  sys: {
    id: "contentful-navigation-id"
  },
  label: "Navigation label",
  link: createContentfulLink(),
  linksCollection: {
    items: [createContentfulLink(), createNavigationItem()]
  },
  promosCollection: {
    items: [createContentfulPromoData()]
  },
  ...navigation
});

export default createContentfulNavigation;
