import { Box, Design } from "@bmi-digital/components";
import { SVGImport } from "@bmi-digital/svg-import";
import { Account } from "@bmi/intouch-api-types";
import {
  Build,
  Business,
  Home,
  People,
  Place,
  School
} from "@material-ui/icons";
import { QuizIcon } from "../../components/icons";
import { findAccountCompany } from "../../lib/account";
import can from "../../lib/permissions/can";

type Link = {
  href: string;
  icon: SVGImport;
  label: string;
  isVisible: boolean;
};

export const getSidebarLinks = (account: Account, t): Link[] => {
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
      href: "/companies",
      icon: Business,
      label: t("Companies"),
      isVisible: can(account, "navigation", "companies")
    },
    {
      href: `/companies/${findAccountCompany(account)?.id}`,
      icon: Business,
      label: t("Company"),
      isVisible:
        // if the user can see the link to "companies" we don't also show the link to the single company
        !can(account, "navigation", "companies") &&
        can(account, "navigation", "company")
    },
    // TODO: change URL to tools
    {
      href: "/toolkit",
      icon: Build,
      label: t("Tools"),
      isVisible: can(account, "navigation", "tools")
    },
    {
      href: "/admin/markets",
      icon: Place,
      label: t("Markets"),
      isVisible: can(account, "navigation", "marketsAdmin")
    },
    {
      href: "/admin/accounts",
      icon: People,
      label: t("Accounts"),
      isVisible: can(account, "navigation", "accountsAdmin")
    },
    {
      href: "/admin/products",
      icon: Box,
      label: t("Inventory"),
      isVisible: can(account, "navigation", "productsAdmin")
    },
    {
      href: "/faq",
      icon: QuizIcon,
      label: t("FAQ"),
      isVisible: can(account, "navigation", "faq")
    }
  ].filter(({ isVisible }) => isVisible);
};
