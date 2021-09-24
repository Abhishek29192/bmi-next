import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import Typography from "@bmi/typography";
import Icon from "@bmi/icon";
import { BMI } from "@bmi/logo";
import { Notifications, Menu, Close } from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ButtonBase from "@material-ui/core/ButtonBase";
import Drawer from "@material-ui/core/Drawer";
import Avatar from "@material-ui/core/Avatar";
import { gql, useMutation } from "@apollo/client";
import { findAccountTier, isSuperOrMarketAdmin } from "../../lib/account";
import { Link } from "../Link";
import UserMenu from "../UserMenu";
import { Sidebar } from "../Sidebar";
import { NotificationsPanel } from "../NotificationsPanel";
import { useAccountContext } from "../../context/AccountContext";
import styles from "./styles.module.scss";

type HeaderLink = {
  href: string;
  label: string;
  isExternal?: boolean;
};

export type HeaderProps = {
  title: string;
  contactUsLink?: HeaderLink;
  globalExternalLink?: HeaderLink;
  notifications?: any;
};

export const Header = ({
  title,
  contactUsLink,
  globalExternalLink,
  notifications
}: HeaderProps) => {
  const { t } = useTranslation("common");

  const [state, setState] = React.useState({
    notifications: false,
    tabletnav: false,
    mobilenav: false
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    if (anchor == "notifications" && open == false) {
      // trigger notifications read mutation
    }

    setState({ ...state, [anchor]: open });
  };

  const { account } = useAccountContext();

  const subHeading = useMemo(() => {
    return isSuperOrMarketAdmin(account)
      ? t(`roles.${account.role}`)
      : t(`tier.${findAccountTier(account)}`);
  }, [account]);

  React.useEffect(() => {
    function handleResize() {
      toggleDrawer("tabletnav", false);
      toggleDrawer("mobilenav", false);
    }

    window.addEventListener("resize", handleResize);
  });

  const TabletNavButton = () => {
    if (state["tabletnav"] == true) {
      return (
        <div className={styles.tabletNavButton}>
          <ButtonBase
            onClick={toggleDrawer("tabletnav", false)}
            id="tablet-navigation-panel-toggle"
          >
            <Icon source={Close} fontSize="large" color="primary" />
          </ButtonBase>
        </div>
      );
    } else {
      return (
        <div className={styles.tabletNavButton}>
          <ButtonBase
            onClick={toggleDrawer("tabletnav", true)}
            id="tablet-navigation-panel-toggle"
          >
            <Icon source={Menu} fontSize="large" color="primary" />
          </ButtonBase>
        </div>
      );
    }
  };

  const MobileNavButton = () => {
    if (state["mobilenav"] == true) {
      return (
        <div className={styles.mobileNavButton}>
          <ButtonBase
            onClick={toggleDrawer("mobilenav", false)}
            id="mobile-navigation-panel-toggle"
          >
            <Icon source={Close} fontSize="large" color="primary" />
          </ButtonBase>
        </div>
      );
    } else {
      return (
        <div className={styles.mobileNavButton}>
          <ButtonBase
            onClick={toggleDrawer("mobilenav", true)}
            id="mobile-navigation-panel-toggle"
          >
            <Icon source={Menu} fontSize="large" color="primary" />
          </ButtonBase>
        </div>
      );
    }
  };

  const MobileUserMenu = () => {
    return (
      <div className={styles.mobileUserMenu}>
        <div className={styles.mobileUserMenuHeader}>
          <Avatar className={styles.mobileUserAvatar} />
          <Typography component="span" className={styles.mobileUserHeading}>
            {t("Account")}
          </Typography>
        </div>
        <div className={styles.mobileUserMenuLinks}>
          <Link href="/profile">
            <a>{t("Profile")}</a>
          </Link>
          <Link href="/api/auth/logout">
            <a>{t("Logout ")}</a>
          </Link>
        </div>
      </div>
    );
  };

  const accountTierName = useMemo(() => {
    return t(`tier.${findAccountTier(account)}`);
  }, [account]);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.header}>
        <div className={styles.upperHeader}>
          <nav>
            {contactUsLink ? (
              <Link
                href={contactUsLink.href}
                isExternal={contactUsLink.isExternal}
              >
                {contactUsLink.label}
              </Link>
            ) : null}

            {globalExternalLink ? (
              <Link
                href={globalExternalLink.href}
                isExternal={globalExternalLink.isExternal}
              >
                {globalExternalLink.label}
              </Link>
            ) : null}
          </nav>
        </div>

        <div className={styles.midHeader}>
          <Link href="/">
            <Icon
              source={BMI}
              className={styles.logo}
              style={{ width: 50, display: "block" }}
            />
          </Link>
          <div className={styles.midHeaderNav}>
            <IconButton
              onClick={toggleDrawer("notifications", true)}
              id="notifications-panel-toggle"
            >
              <Icon source={Notifications} color="primary" fontSize="large" />
            </IconButton>
            <TabletNavButton />
            <MobileNavButton />
          </div>
        </div>

        <div className={styles.lowerHeader}>
          <div className={styles.lowerHeaderMeta}>
            <Typography variant="h3">{title}</Typography>
            <Divider
              orientation="vertical"
              flexItem
              style={{ margin: "0 1rem" }}
            />
            <Typography variant="h3" className={styles.lowerHeaderUserLevel}>
              {subHeading}
            </Typography>
          </div>

          <div className={styles.lowerHeaderNav}>
            <IconButton onClick={toggleDrawer("notifications", true)}>
              <Icon source={Notifications} color="primary" />
            </IconButton>
            <UserMenu />
          </div>
        </div>
      </div>

      <Drawer anchor="right" open={state["notifications"]}>
        <div className={styles.notifications}>
          <div className={styles.notificationsHeader}>
            <Typography variant="h5">{t("Notifications")}</Typography>
            <IconButton onClick={toggleDrawer("notifications", false)}>
              <Icon source={Close} style={{ fontSize: 24 }} />
            </IconButton>
          </div>
          <NotificationsPanel notifications={notifications} />
        </div>
      </Drawer>

      <Drawer
        anchor="left"
        open={state["tabletnav"]}
        className={styles.tabletSidebarContainer}
      >
        <div className={styles.tabletSidebar}>
          <div className={styles.tabletNav}>
            <Sidebar />
          </div>
          <div>
            <MobileUserMenu />
          </div>
        </div>
      </Drawer>

      <Drawer
        anchor="top"
        open={state["mobilenav"]}
        className={styles.mobileSidebarContainer}
      >
        <div className={styles.mobileSidebar}>
          <div className={styles.mobileNav}>
            <Sidebar />
          </div>
          <div>
            <MobileUserMenu />
          </div>
        </div>
      </Drawer>
    </div>
  );
};
