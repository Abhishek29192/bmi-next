import type { NavigationItem } from "../../components/link/types";

const createNavigationItem = (
  navigationItem?: Partial<NavigationItem>
): NavigationItem => ({
  __typename: "NavigationItem",
  type: "Heading",
  value: "Heading value",
  ...navigationItem
});

export default createNavigationItem;
