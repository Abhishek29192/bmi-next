import { Home, Build, School, People, Business } from "@material-ui/icons";
import { Box, Design } from "@bmi/icon";
import { Account } from "@bmi/intouch-api-types";
import can from "../../lib/permissions/can";

export const getSidebarLinks = (account: Account, t) => {
  return [
    {
      href: "/",
      icon: Home,
      label: t("Home"),
      isVisible: can(account, "navigation", "home")
    },
    {
      href: "/projects",
      icon: Design,
      label: t("Projects"),
      isVisible: can(account, "navigation", "projects")
    },
    {
      href: "/training",
      icon: School,
      label: t("Training"),
      isVisible: can(account, "navigation", "training")
    },
    {
      href: "/team",
      icon: People,
      label: t("Team"),
      isVisible: can(account, "navigation", "team")
    },
    {
      href: "/company",
      icon: Business,
      label: t("Company"),
      isVisible: can(account, "navigation", "company")
    },
    // TODO: change URL to tools
    {
      href: "/toolkit",
      icon: Build,
      label: t("Tools"),
      isVisible: can(account, "navigation", "tools")
    },
    {
      href: "/admin/products",
      icon: Box,
      label: t("Inventory"),
      isVisible: can(account, "navigation", "productsAdmin")
    }
  ].filter(({ isVisible }) => isVisible);
};
