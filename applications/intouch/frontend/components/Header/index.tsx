import React, { useState, useMemo } from "react";
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
import { gql } from "@apollo/client";
import { findAccountTier, isSuperOrMarketAdmin } from "../../lib/account";
import { Link } from "../Link";
import UserMenu from "../UserMenu";
import { Sidebar } from "../Sidebar";
import { NotificationsPanel } from "../NotificationsPanel";
import { useAccountContext } from "../../context/AccountContext";
import log from "../../lib/logger";
import { mergeByKey } from "../../lib/utils/object";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import { useMarkAllNotificationsAsReadMutation } from "../../graphql/generated/hooks";
import styles from "./styles.module.scss";

type HeaderLink = {
  href: string;
  label: string;
  isExternal?: boolean;
};

export type HeaderProps = {
  title: string;
  attentionHeading?: string;
  contactUsLink?: HeaderLink;
  globalExternalLink?: HeaderLink;
  notifications?: GetGlobalDataQuery["notifications"]["nodes"];
};

export const Header = ({
  title,
  attentionHeading,
  contactUsLink,
  globalExternalLink,
  notifications: initialNotifications
}: HeaderProps) => {
  const { t } = useTranslation("common");
  const { account } = useAccountContext();
  // NOTE: workaround to client not being aware of cache to re-render from.
  const [notifications, setNotifications] = useState(initialNotifications);

  const [state, setState] = React.useState({
    notifications: false,
    tabletnav: false,
    mobilenav: false
  });

  const hasUnreadNotifications = useMemo(
    () => notifications.some(({ read }) => !read),
    [notifications]
  );
  const notificationsIconClasses = {
    root: [
      styles.notificationsIcon,
      hasUnreadNotifications && styles["notificationsIcon--unread"]
    ]
      .filter(Boolean)
      .join(" ")
  };

  const [updateNotifications] = useMarkAllNotificationsAsReadMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error marking notifications as read: ${error.toString()}`
      });
    },
    onCompleted: ({
      markAllNotificationsAsRead: { notifications: updatedNotifications }
    }) => {
      log({
        severity: "INFO",
        message: `${updatedNotifications.length} Notifications for account [${account.id}] set as read.`
      });

      setNotifications(
        mergeByKey<GetGlobalDataQuery["notifications"]["nodes"][0]>(
          notifications,
          updatedNotifications,
          "id"
        )
      );
    }
  });

  const toggleDrawer = (anchor: string, open?: boolean) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    // If open is not passed, toggle state.
    if (typeof open === "undefined") {
      open = !state[anchor];
    }

    if (anchor === "notifications" && open === false) {
      // No need to await it as such, not handled at this time.
      updateNotifications({
        variables: {
          accountId: account.id
        }
      });
    }

    setState({ ...state, [anchor]: open });
  };

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
    if (state["tabletnav"] === true) {
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
    if (state["mobilenav"] === true) {
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
            <a>{t("Logout")}</a>
          </Link>
        </div>
      </div>
    );
  };

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
              classes={notificationsIconClasses}
              onClick={toggleDrawer("notifications")}
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
              className={styles.lowerHeaderDivider}
            />
            <Typography variant="h3" className={styles.lowerHeaderUserLevel}>
              {subHeading}
            </Typography>
            {attentionHeading && (
              <>
                <Divider
                  orientation="vertical"
                  flexItem
                  className={styles.lowerHeaderDivider}
                />
                <Typography variant="h3" className={styles.attentionHeading}>
                  {attentionHeading}
                </Typography>
              </>
            )}
          </div>

          <div className={styles.lowerHeaderNav}>
            <IconButton
              classes={notificationsIconClasses}
              onClick={toggleDrawer("notifications")}
            >
              <Icon source={Notifications} color="primary" />
            </IconButton>
            <UserMenu />
          </div>
        </div>
      </div>

      <Drawer
        className={styles.notificationsContainer}
        anchor="right"
        open={state["notifications"]}
        onClose={toggleDrawer("notifications", false)}
        BackdropProps={{ style: { opacity: 0 } }}
      >
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
        onClose={toggleDrawer("tabletnav", false)}
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
        onClose={toggleDrawer("mobilenav", false)}
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

export const markAllNotificationsAsRead = gql`
  mutation markAllNotificationsAsRead($accountId: Int!) {
    markAllNotificationsAsRead(input: { accountToUpdateId: $accountId }) {
      notifications {
        # Only fetching IDs and read status for Apollo to update client cache
        id
        read
      }
    }
  }
`;
