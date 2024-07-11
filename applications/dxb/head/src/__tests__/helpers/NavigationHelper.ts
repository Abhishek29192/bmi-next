import createNavigationItem from "./NavigationItemHelper";
import createPromoData from "./PromoHelper";
import createLinkData from "./LinkHelper";
import type { NavigationData } from "../../components/link/types";

const createNavigation = (
  navigation?: Partial<NavigationData>
): NavigationData => ({
  __typename: "Navigation",
  label: "Navigation label",
  link: createLinkData(),
  links: [createLinkData(), createNavigationItem()],
  promos: [createPromoData()],
  ...navigation
});

export default createNavigation;
